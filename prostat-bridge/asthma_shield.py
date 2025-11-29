#!/usr/bin/env python3
"""
Asthma Shield - Closed-Loop Building Management System (BMS)
Raspberry Pi 3 - Complete air quality and environmental control

This script implements intelligent, coordinated control of:
- Ecobee thermostat (temperature, humidity, motion, HVAC)
- Blueair air purifier (PM2.5, tVOC, filtration speed)
- Dehumidifier relay (humidity control)

The "Asthma Shield" Logic:
1. Monitor air quality (PM2.5, humidity, occupancy)
2. Automatically adjust Blueair speed based on PM2.5 levels
3. Control dehumidifier based on humidity thresholds
4. Coordinate HVAC fan for optimal air circulation
5. Hourly "circulation kick" to verify air quality

Requirements:
    pip install aiohomekit aiohttp pyserial blueair-api

Usage:
    python asthma_shield.py
    # Or run as systemd service: sudo systemctl start asthma-shield
"""

import asyncio
import logging
import os
from datetime import datetime
from blueair_api import get_blueair_account
from aiohomekit.controller import Controller
from aiohomekit.exceptions import AccessoryNotFoundError
import serial
import serial.tools.list_ports

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# Configuration
# ============================================================================

# Air Quality Thresholds
PM25_THRESHOLD_HIGH = 10  # µg/m³ - Engage max filtration
PM25_THRESHOLD_MEDIUM = 5  # µg/m³ - Medium filtration if occupied

# Humidity Thresholds
HUMIDITY_HIGH = 55  # % - Turn on dehumidifier
HUMIDITY_LOW = 45  # % - Turn off dehumidifier

# Circulation Kick
CIRCULATION_KICK_INTERVAL = 60  # minutes - Run every hour
CIRCULATION_KICK_PM25_THRESHOLD = 2  # µg/m³ - Only if air is clean

# Polling Interval
MAIN_LOOP_INTERVAL = 60  # seconds

# ============================================================================
# Global State
# ============================================================================

# Ecobee
ecobee_controller = None
ecobee_pairing = None
ecobee_device_id = None

# Blueair
blueair_account = None
blueair_devices = []
blueair_connected = False

# Relay (Dehumidifier)
relay_port = None
relay_connected = False
relay_channel = 2  # Default: Relay 2 for dehumidifier

# System State
system_state = {
    'pm25': None,
    'tvoc': None,
    'humidity': None,
    'temperature': None,
    'occupancy': False,
    'last_circulation_kick': None,
}

# Characteristic IDs for Ecobee (adjust based on your device)
ECOBEE_AID = 1
ECOBEE_TEMP_CURRENT = 10
ECOBEE_HUMIDITY = 11  # May need adjustment
ECOBEE_TARGET_STATE = 12
ECOBEE_CURRENT_STATE = 13
ECOBEE_FAN_MODE = 14  # May need adjustment


# ============================================================================
# Initialization
# ============================================================================

async def init_ecobee():
    """Initialize Ecobee HomeKit connection"""
    global ecobee_controller, ecobee_pairing, ecobee_device_id
    
    try:
        # Get device ID from environment or config
        device_id = os.getenv('ECOBEE_DEVICE_ID')
        if not device_id:
            logger.warning("ECOBEE_DEVICE_ID not set. Ecobee control disabled.")
            return False
        
        ecobee_controller = Controller()
        await ecobee_controller.async_start()
        
        # Load existing pairing
        try:
            ecobee_pairing = await ecobee_controller.async_load_pairing(device_id)
            ecobee_device_id = device_id
            logger.info(f"Ecobee connected: {device_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to load Ecobee pairing: {e}")
            return False
    except Exception as e:
        logger.error(f"Failed to initialize Ecobee: {e}")
        return False


async def init_blueair():
    """Initialize Blueair connection"""
    global blueair_account, blueair_devices, blueair_connected
    
    try:
        username = os.getenv('BLUEAIR_USERNAME')
        password = os.getenv('BLUEAIR_PASSWORD')
        
        if not username or not password:
            logger.warning("Blueair credentials not set. Blueair control disabled.")
            return False
        
        blueair_account = await get_blueair_account(username=username, password=password)
        blueair_devices = blueair_account.devices
        blueair_connected = True
        logger.info(f"Blueair connected: {len(blueair_devices)} device(s)")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to Blueair: {e}")
        blueair_connected = False
        return False


def find_relay_port():
    """Find USB relay module (CH340)"""
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if 'CH340' in port.description or 'CH340' in port.manufacturer:
            return port.device
        if port.vid == 0x1a86 and port.pid == 0x7523:  # CH340 VID/PID
            return port.device
    return None


async def init_relay():
    """Initialize USB relay connection"""
    global relay_port, relay_connected
    
    try:
        port_path = find_relay_port()
        if not port_path:
            logger.warning("No USB relay module found. Dehumidifier control disabled.")
            return False
        
        relay_port = serial.Serial(
            port_path,
            baudrate=9600,
            timeout=1,
            write_timeout=1
        )
        relay_connected = True
        logger.info(f"USB relay connected on {port_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to relay: {e}")
        relay_connected = False
        return False


# ============================================================================
# Sensor Reading Functions
# ============================================================================

async def get_ecobee_humidity():
    """Get humidity from Ecobee"""
    global ecobee_pairing
    
    if not ecobee_pairing:
        return None
    
    try:
        # Read humidity characteristic
        # Note: Ecobee may expose humidity differently - adjust iid as needed
        data = await ecobee_pairing.async_get_characteristics([
            (ECOBEE_AID, ECOBEE_HUMIDITY)
        ])
        
        key = (ECOBEE_AID, ECOBEE_HUMIDITY)
        if key in data:
            return data[key].get('value')
        return None
    except Exception as e:
        logger.error(f"Error reading Ecobee humidity: {e}")
        return None


async def get_ecobee_temperature():
    """Get temperature from Ecobee"""
    global ecobee_pairing
    
    if not ecobee_pairing:
        return None
    
    try:
        data = await ecobee_pairing.async_get_characteristics([
            (ECOBEE_AID, ECOBEE_TEMP_CURRENT)
        ])
        
        key = (ECOBEE_AID, ECOBEE_TEMP_CURRENT)
        if key in data:
            return data[key].get('value')
        return None
    except Exception as e:
        logger.error(f"Error reading Ecobee temperature: {e}")
        return None


async def get_ecobee_occupancy():
    """Get occupancy status from Ecobee motion sensors"""
    global ecobee_pairing
    
    if not ecobee_pairing:
        return False
    
    try:
        # Ecobee motion sensors are typically exposed as separate accessories
        # For now, we'll use a simplified approach
        # In a full implementation, you'd enumerate all accessories and check motion sensors
        
        # Placeholder: Check if we can get occupancy from system state
        # This would need to be implemented based on your specific Ecobee setup
        return system_state.get('occupancy', False)
    except Exception as e:
        logger.error(f"Error reading Ecobee occupancy: {e}")
        return False


async def get_blueair_pm25():
    """Get PM2.5 reading from Blueair"""
    global blueair_devices, blueair_connected
    
    if not blueair_connected or not blueair_devices:
        return None
    
    try:
        # Note: blueair-api may have different methods for getting sensor data
        # This is a placeholder - adjust based on actual API
        purifier = blueair_devices[0]
        
        # Try to get sensor data
        # The actual method depends on the blueair-api library version
        # For now, we'll use a placeholder that you can adjust
        
        # Example (adjust based on actual API):
        # sensor_data = await purifier.get_sensor_data()
        # return sensor_data.get('pm25')
        
        # Placeholder: Return from system state if available
        return system_state.get('pm25')
    except Exception as e:
        logger.error(f"Error reading Blueair PM2.5: {e}")
        return None


async def get_blueair_tvoc():
    """Get tVOC reading from Blueair"""
    global blueair_devices, blueair_connected
    
    if not blueair_connected or not blueair_devices:
        return None
    
    try:
        # Similar to PM2.5 - adjust based on actual API
        return system_state.get('tvoc')
    except Exception as e:
        logger.error(f"Error reading Blueair tVOC: {e}")
        return None


# ============================================================================
# Actuator Control Functions
# ============================================================================

async def set_blueair_speed(speed):
    """Set Blueair fan speed (0=off, 1=low, 2=medium, 3=max)"""
    global blueair_devices, blueair_connected
    
    if not blueair_connected or not blueair_devices:
        logger.warning("Blueair not connected. Cannot set speed.")
        return False
    
    try:
        purifier = blueair_devices[0]
        await purifier.set_fan_speed(speed)
        logger.info(f"Blueair speed set to {speed}")
        return True
    except Exception as e:
        logger.error(f"Failed to set Blueair speed: {e}")
        return False


async def set_ecobee_fan_mode(mode):
    """Set Ecobee fan mode ('on' or 'auto')"""
    global ecobee_pairing
    
    if not ecobee_pairing:
        logger.warning("Ecobee not connected. Cannot set fan mode.")
        return False
    
    try:
        # Map mode to HomeKit value
        # Fan mode: 0=auto, 1=on
        fan_value = 1 if mode == 'on' else 0
        
        # Write fan mode characteristic
        # Note: Adjust iid based on your Ecobee's actual characteristics
        await ecobee_pairing.async_put_characteristics([
            (ECOBEE_AID, ECOBEE_FAN_MODE, fan_value)
        ])
        
        logger.info(f"Ecobee fan mode set to {mode}")
        return True
    except Exception as e:
        logger.error(f"Failed to set Ecobee fan mode: {e}")
        return False


def set_dehumidifier_relay(on):
    """Control dehumidifier relay (True=on, False=off)"""
    global relay_port, relay_connected
    
    if not relay_connected or not relay_port:
        logger.warning("Relay not connected. Cannot control dehumidifier.")
        return False
    
    try:
        # AT command format: AT+ON1\r\n or AT+OFF1\r\n
        command = f"AT+{'ON' if on else 'OFF'}{relay_channel}\r\n"
        relay_port.write(command.encode())
        logger.info(f"Dehumidifier relay {'ON' if on else 'OFF'}")
        return True
    except Exception as e:
        logger.error(f"Failed to control relay: {e}")
        return False


# ============================================================================
# Asthma Shield Logic
# ============================================================================

async def evaluate_air_quality_threat(pm25, is_occupied):
    """
    Evaluate air quality threat level and adjust Blueair + Ecobee fan
    
    Logic:
    - PM2.5 > 10: Max filtration + circulate air
    - PM2.5 > 5 and occupied: Medium filtration
    - Otherwise: Low/Silent
    """
    if pm25 is None:
        logger.warning("PM2.5 reading unavailable. Skipping air quality control.")
        return
    
    if pm25 > PM25_THRESHOLD_HIGH:
        # High threat: Dust detected. Engage scrubbers.
        logger.info(f"🚨 HIGH PM2.5 ({pm25} µg/m³): Engaging max filtration")
        await set_blueair_speed(3)  # Max
        await set_ecobee_fan_mode('on')  # Circulate air to the filter
        
    elif pm25 > PM25_THRESHOLD_MEDIUM and is_occupied:
        # Medium threat: Minor dust, but people are here. Be polite.
        logger.info(f"⚠️  MEDIUM PM2.5 ({pm25} µg/m³) + Occupied: Medium filtration")
        await set_blueair_speed(2)  # Medium
        
    else:
        # Low threat: Air is clean. Save energy/noise.
        logger.info(f"✅ LOW PM2.5 ({pm25} µg/m³): Low/Silent mode")
        await set_blueair_speed(1)  # Low/Silent
        # Don't force fan off - let Ecobee manage it


async def evaluate_humidity_threat(humidity):
    """
    Evaluate humidity threat level and control dehumidifier
    
    Logic:
    - Humidity > 55%: Mold risk. Turn on dehumidifier.
    - Humidity < 45%: Too dry. Turn off dehumidifier.
    """
    if humidity is None:
        logger.warning("Humidity reading unavailable. Skipping humidity control.")
        return
    
    if humidity > HUMIDITY_HIGH:
        # Mold risk. Dry it out.
        logger.info(f"💧 HIGH Humidity ({humidity}%): Turning on dehumidifier")
        set_dehumidifier_relay(True)
        
    elif humidity < HUMIDITY_LOW:
        # Too dry. Stop drying.
        logger.info(f"🌵 LOW Humidity ({humidity}%): Turning off dehumidifier")
        set_dehumidifier_relay(False)
    
    # If between 45-55%, maintain current state (hysteresis)


async def circulation_kick():
    """
    The "Circulation Kick" - Every hour, if air is clean, stir it up to verify.
    
    Logic:
    - Run every hour (at minute 0)
    - Only if PM2.5 < 2 (we think it's clean)
    - Turn on Ecobee fan to "stir the pot" and verify air quality
    """
    now = datetime.now()
    last_kick = system_state.get('last_circulation_kick')
    
    # Check if it's time for a circulation kick (every hour)
    should_kick = False
    if last_kick is None:
        # First run - kick if it's at the top of the hour
        should_kick = now.minute == 0
    else:
        # Check if an hour has passed
        time_diff = (now - last_kick).total_seconds() / 60
        should_kick = time_diff >= CIRCULATION_KICK_INTERVAL
    
    if not should_kick:
        return
    
    pm25 = system_state.get('pm25')
    if pm25 is None or pm25 >= CIRCULATION_KICK_PM25_THRESHOLD:
        logger.debug(f"Skipping circulation kick: PM2.5 ({pm25}) not clean enough")
        return
    
    # Air is clean. Prove it by stirring.
    logger.info(f"🌀 Circulation Kick: Stirring air (PM2.5: {pm25} µg/m³)")
    await set_ecobee_fan_mode('on')
    system_state['last_circulation_kick'] = now
    
    # Turn fan off after 5 minutes (let it run briefly)
    await asyncio.sleep(300)  # 5 minutes
    await set_ecobee_fan_mode('auto')


# ============================================================================
# Main Control Loop
# ============================================================================

async def asthma_shield_loop():
    """Main control loop - The Brain"""
    logger.info("🧠 Asthma Shield BMS starting...")
    logger.info("=" * 60)
    
    # Initialize all systems
    logger.info("Initializing systems...")
    await init_ecobee()
    await init_blueair()
    await init_relay()
    
    logger.info("=" * 60)
    logger.info("✅ Systems initialized. Starting control loop...")
    logger.info("=" * 60)
    
    iteration = 0
    
    while True:
        try:
            iteration += 1
            logger.info(f"\n--- Iteration #{iteration} ---")
            
            # 1. GATHER INTEL
            logger.info("📊 Gathering sensor data...")
            
            pm25 = await get_blueair_pm25()
            tvoc = await get_blueair_tvoc()
            humidity = await get_ecobee_humidity()
            temperature = await get_ecobee_temperature()
            is_occupied = await get_ecobee_occupancy()
            
            # Update system state
            system_state['pm25'] = pm25
            system_state['tvoc'] = tvoc
            system_state['humidity'] = humidity
            system_state['temperature'] = temperature
            system_state['occupancy'] = is_occupied
            
            logger.info(f"  PM2.5: {pm25} µg/m³" if pm25 else "  PM2.5: N/A")
            logger.info(f"  tVOC: {tvoc} ppb" if tvoc else "  tVOC: N/A")
            logger.info(f"  Humidity: {humidity}%" if humidity else "  Humidity: N/A")
            logger.info(f"  Temperature: {temperature}°F" if temperature else "  Temperature: N/A")
            logger.info(f"  Occupancy: {'Yes' if is_occupied else 'No'}")
            
            # 2. THREAT LEVEL: AIR QUALITY
            logger.info("\n🔍 Evaluating air quality threat...")
            await evaluate_air_quality_threat(pm25, is_occupied)
            
            # 3. THREAT LEVEL: MOLD (The Dehumidifier Logic)
            logger.info("\n💧 Evaluating humidity threat...")
            await evaluate_humidity_threat(humidity)
            
            # 4. THE "CIRCULATION KICK" (The Clean Bubble Fix)
            logger.info("\n🌀 Checking circulation kick...")
            await circulation_kick()
            
            logger.info(f"\n✅ Control cycle complete. Sleeping {MAIN_LOOP_INTERVAL}s...")
            
        except KeyboardInterrupt:
            logger.info("\n🛑 Shutting down Asthma Shield...")
            break
        except Exception as e:
            logger.error(f"❌ Error in control loop: {e}", exc_info=True)
            logger.info(f"Retrying in {MAIN_LOOP_INTERVAL}s...")
        
        await asyncio.sleep(MAIN_LOOP_INTERVAL)


# ============================================================================
# Entry Point
# ============================================================================

async def main():
    """Main entry point"""
    try:
        await asthma_shield_loop()
    except KeyboardInterrupt:
        logger.info("\n👋 Asthma Shield stopped by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(main())

