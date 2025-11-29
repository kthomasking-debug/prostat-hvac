# 🏠 Smart Thermostat Build Guide

## Using Your eBay Parts with Web Serial API

---

## 📦 Parts Compatibility Analysis

### ✅ What You Have (All Compatible!)

| Part | Status | Notes |

|------|--------|-------|

| Wall Mounted Mobile AC L-2008 | ✓ Perfect | Your HVAC unit to control |

| DS18B20 USB Thermometer | ✓ Perfect | Works with Web Serial API |

| CH340 8CH USB Relay Module | ✓ Perfect | Already supported in codebase |

| Onn. Surf 7" Tablet | ✓ Perfect | Android tablet for display |

| 24VAC to 12VDC Converter | 🛒 Needed | Powers relay module |

| 24VAC to 5VDC USB Converter | 🛒 Needed | Powers tablet via USB |

| USB Cables/Adapters | 🛒 Needed | For connections |

| Tablet Wall Mount | ⭐ Nice to have | For mounting |

### 🔧 Optional but Recommended

- **USB Hub** - If connecting both relay + sensor to tablet

- **Wire nuts / electrical connectors** - For safe wiring

- **18-22 AWG wire** - For low-voltage connections

- **Electrical tape** - For safety

- **14-16 AWG wire** - For 120VAC connections

- **Multimeter** - For testing connections

---

## 🔌 Complete Wiring Diagram

### Power Distribution Flow

```
Furnace/AC Transformer (24VAC)

    │

    ├─→ 24VAC to 12VDC Converter ──→ Relay Module Power (12VDC)

    │

    └─→ 24VAC to 5VDC USB Converter ──→ Tablet USB-C (5VDC, 3A)

```

### Control Wiring Layout

```
Relay Module (CH340)          Wall AC Unit

───────────────────          ──────────────

Relay 1 (NO)  ────→          Power Control

Relay 2 (NO)  ────→          (Reserved)

Relay 3 (NO)  ────→          (Reserved)

Common (C)    ────→          Common/Neutral

```

### USB Connection Tree

```
Tablet (USB-C)

    │

    └─→ USB-C to USB-A OTG Adapter

            │

            └─→ USB Hub (recommended)

                    │

                    ├─→ USB-B to USB-A Cable ──→ Relay Module

                    │

                    └─→ USB-A Cable ──→ DS18B20 Thermometer

```

---

## 📋 Step-by-Step Setup

### Step 1: Power Supply Setup ⚡

#### For Relay Module (12VDC)

1. **Connect 24VAC to 12VDC converter** to your furnace/AC transformer

   - **Input:** Connect to 24VAC transformer (R and C terminals)

   - **Output:** Connect to relay module's power terminals (+12V and GND)

2. **⚠️ Important:** The relay module needs external power even when connected via USB!

#### For Tablet (5VDC USB)

1. **Connect 24VAC to 5VDC USB converter** to transformer

   - **Input:** Connect to 24VAC transformer (same R and C terminals)

   - **Output:** USB-C connector to tablet

2. This will power the tablet continuously (no battery needed!)

---

### Step 2: USB Connections 🔗

#### Option A: Direct Connection (One Device at a Time)

- Connect relay module **OR** temperature sensor (not both simultaneously)

- Use USB-C to USB-A OTG adapter

- Then USB-A to USB-B cable for relay, or USB-A cable for sensor

#### Option B: USB Hub (⭐ Recommended)

- Connect USB hub to tablet via OTG adapter

- Connect relay module to hub (USB-B to USB-A cable)

- Connect temperature sensor to hub (USB-A cable)

> **💡 Tip:** The Onn. Surf tablet may have limited USB OTG power. A powered USB hub is recommended if you experience issues.

---

### Step 3: AC Unit Control Wiring 🔌

#### ⚠️ SAFETY FIRST

**Unplug AC unit before wiring!**

#### Understanding Your AC Unit

The Wall-Mounted Mobile AC L-2008 has:

- Power cord (120VAC)

- Control board

- Compressor

- Fan

#### Option 1: Control Power to Entire Unit (Safest)

**How it works:**

1. Relay controls the AC's power supply

2. Wire relay in series with the hot wire (120VAC)

3. When relay closes → AC gets power → runs

4. When relay opens → AC loses power → stops

**Wiring Diagram:**

```
Wall Outlet (120VAC)

    │

    ├─ Hot Wire (Black) ──→ Relay 1 (NO terminal)

    │                           │

    │                           └─→ Hot Wire ──→ AC Unit

    │

    └─ Neutral Wire (White) ─────────────────→ AC Unit

```

#### ⚠️ Critical Safety Checks

- Your relay module is rated for **10A @ 250VAC**

- Check your AC unit's amperage rating (usually 5-15A)

- **If AC draws more than 10A, you MUST use a contactor (heavy-duty relay)**

- Find amperage on AC unit's label/nameplate

#### Option 2: Control via AC's Control Board (Advanced)

If the AC unit has low-voltage control terminals (like a furnace), you can control it directly. Check the AC unit's manual for control board access.

---

### Step 4: Temperature Sensor Placement 🌡️

#### Optimal Sensor Location

1. **Mount DS18B20 sensor** in a location that represents room temperature:

   - ✅ Away from direct sunlight

   - ✅ Away from AC vents

   - ✅ At average room height (4-5 feet)

   - ✅ Not near heat sources (lamps, computers, stoves)

   - ✅ Good air circulation

2. **Connect USB cable** from sensor to tablet (via hub if using both devices)

3. **Data format:** Sensor sends temperature automatically every 10 seconds in ASCII format

   - Example: `+25.3C` or `+77.5F`

---

## 💻 Software Configuration

### Step 1: Enable Web Serial API Support

Your codebase already supports this! Just ensure:

1. **Tablet Browser:** Use Chrome or Edge (Web Serial API support required)

2. **Permissions:** Grant serial port access when prompted

3. **HTTPS:** App must be served over HTTPS or localhost

---

### Step 2: Configure Relay Module

The CH340 relay module uses **AT commands**. Your codebase already supports this!

#### In Your React App:

```javascript
import { getWebSerialRelay } from "../lib/webSerialRelay";

const relay = getWebSerialRelay();

await relay.connect();

// Use 'at' command format for CH340 modules

await relay.toggleTerminal("W", true, "at"); // Turn on Heat

await relay.toggleTerminal("Y", true, "at"); // Turn on Cool

await relay.toggleTerminal("G", true, "at"); // Turn on Fan
```

#### Relay Mapping:

| Relay | Terminal | Function | Status |

|-------|----------|----------|--------|

| Relay 1 | W | Heat/AC Power Control | Active |

| Relay 2 | Y | Cool (Reserved) | Future use |

| Relay 3 | G | Fan (Reserved) | Future use |

---

### Step 3: Configure Temperature Sensor

The DS18B20 USB thermometer works automatically with Web Serial API:

1. Connect via serial port

2. Read incoming data stream

3. Parse ASCII temperature format (`+XX.XC`)

4. Update display every 10 seconds

---

## 🧪 Testing Procedure

### Test 1: USB Connections ✓

1. Connect relay module to tablet

2. Open Chrome/Edge on tablet

3. Navigate to your app

4. Go to "Contactor Demo" or "Short Cycle Test" page

5. Click "Connect Relay"

6. Grant serial port permission

7. Verify connection status shows "Connected"

**Expected result:** ✅ Connection established, no errors

---

### Test 2: Relay Control ✓

1. With relay connected, toggle relays on/off via app

2. **Listen for relay clicks** (mechanical relays make an audible click)

3. **Check LED indicators** on relay module (if present)

4. Use multimeter to verify relay contacts are closing (continuity test)

**Expected result:** ✅ Audible clicks, LED changes, continuity when closed

---

### Test 3: Temperature Sensor ✓

1. Connect DS18B20 sensor to tablet

2. Open serial port to sensor in app

3. Wait 10 seconds for first reading

4. Verify temperature data appears (format: `+25.3C`)

5. Compare with known good room thermometer

**Expected result:** ✅ Readings appear, within ±1°C of reference

---

### Test 4: AC Unit Control ✓

#### ⚠️ SAFETY: Have someone watch the AC unit during testing!

1. **Wire relay to AC power** (see Step 3 above)

2. **Set AC unit's built-in thermostat to coldest** (or bypass it)

3. **Connect relay module** to tablet

4. **Turn on relay** via app

5. **Verify AC unit starts** (listen for compressor and fan)

6. **Turn off relay** via app

7. **Verify AC unit stops**

**Expected result:** ✅ AC responds immediately to relay commands

---

### Test 5: Full Thermostat Control ✓

1. **Connect both relay and sensor** to tablet (via USB hub)

2. **Set target temperature** in app (e.g., 72°F)

3. **Set differential** (e.g., 2°F)

4. **Let system run automatically:**

   - When room temp > target + differential → AC turns on

   - When room temp < target - differential → AC turns off

5. **Monitor for 30 minutes** to verify proper cycling

**Expected result:** ✅ Automatic temperature control, proper cycling

---

## ⚠️ Important Safety Notes

### Electrical Safety 🔒

1. **Always unplug AC unit** before wiring

2. **Use proper wire gauge:**

   - 18-22 AWG for low voltage (24V)

   - 14-16 AWG for 120VAC

3. **Use wire nuts** for connections (don't just twist wires)

4. **Wrap connections in electrical tape** for safety

5. **Test with multimeter** before powering on

6. **Check relay rating** (10A max) vs AC unit amperage

7. **Use strain relief** on all connections

8. **Keep water away** from all electrical connections

---

### Power Considerations ⚡

1. **Relay module needs external power** (12VDC from converter)

2. **Tablet needs power** (5VDC USB from converter)

3. **Both converters need 24VAC input** (from furnace/AC transformer)

4. **If transformer can't handle load**, use separate 24VAC transformer

5. **Calculate total load:**

   - Relay module: ~500mA @ 12V = 6W

   - Tablet: ~2A @ 5V = 10W

   - Total: ~16W from 24VAC transformer

---

### AC Unit Compatibility 🔍

#### Wall-Mounted Mobile AC L-2008 Specifications

**You must verify:**

- Unit's power rating (watts/amperage) - check nameplate

- Relay can handle the load (10A @ 250VAC max)

- **If unit draws more than 10A, you MUST use a contactor**

**Typical AC unit ratings:**

- Small (5,000 BTU): 4-5A

- Medium (8,000 BTU): 7-8A

- Large (12,000 BTU): 10-12A ⚠️ May need contactor

---

## 🔧 Troubleshooting

### Relay Module Not Detected

**Symptoms:** Tablet doesn't see relay module

**Solutions:**

- ✓ Check USB cable connections (try reseating)

- ✓ Try different USB cable (cable may be data-only)

- ✓ Check USB OTG is enabled in tablet settings

- ✓ Try connecting to computer first to verify module works

- ✓ Check relay module has external power (12VDC)

- ✓ Verify CH340 drivers (usually automatic on Android)

---

### Temperature Sensor Not Reading

**Symptoms:** No temperature data

**Solutions:**

- ✓ Wait 10 seconds (sensor updates every 10s)

- ✓ Check USB connection

- ✓ Verify baud rate is 9600

- ✓ Check sensor is sending data (use serial monitor app)

- ✓ Try different USB port

- ✓ Verify sensor has power (LED should be on)

---

### AC Unit Not Responding

**Symptoms:** Relay clicks but AC doesn't start

**Solutions:**

- ✓ Check wiring connections (loose wire?)

- ✓ Verify relay contacts are closing (use multimeter)

- ✓ Check AC unit's built-in thermostat (set to coldest)

- ✓ Verify AC unit has power (check outlet with lamp)

- ✓ Check relay rating vs AC unit amperage

- ✓ Test AC unit directly (bypass relay temporarily)

- ✓ Check for tripped circuit breaker

---

### Tablet Power Issues

**Symptoms:** Tablet battery drains or won't charge

**Solutions:**

- ✓ Verify 24VAC to 5VDC converter is working (measure output)

- ✓ Check converter output (should be 5V, 3A minimum)

- ✓ Try different USB-C cable (must support power delivery)

- ✓ Check tablet charging port for damage or debris

- ✓ Use powered USB hub if needed

- ✓ Verify converter can supply enough current (3A minimum)

---

## ✅ Final Checklist

### Before Powering On:

- [ ] All wiring connections secure and tight

- [ ] Wire nuts properly installed on all splices

- [ ] Electrical tape on all connections

- [ ] Relay module has external power (12VDC)

- [ ] Tablet has power (5VDC USB)

- [ ] USB connections secure

- [ ] AC unit unplugged during wiring

- [ ] Multimeter tested all connections

- [ ] Relay rating checked vs AC amperage

- [ ] Temperature sensor mounted properly

- [ ] Software configured for AT commands

- [ ] Browser permissions granted

- [ ] No exposed bare wires

- [ ] Strain relief on all cables

---

## 🎯 Next Steps

### Phase 1: Component Testing (1-2 hours)

1. Complete wiring following this guide

2. Test each component individually

3. Verify all connections with multimeter

### Phase 2: Integration Testing (1-2 hours)

1. Test full system integration

2. Calibrate temperature sensor (compare with known good thermometer)

3. Verify relay control of AC unit

### Phase 3: Tuning & Monitoring (24-48 hours)

1. Tune thermostat settings (differential, min on/off times)

2. Monitor for 24-48 hours to verify stability

3. Check for short cycling issues

4. Optimize temperature differential

### Phase 4: Optimization (ongoing)

1. Fine-tune temperature settings based on comfort

2. Monitor energy usage

3. Add additional sensors if needed

4. Implement scheduling features

---

## 📚 Additional Resources

### Documentation Files

- `docs/CH340-RELAY-SETUP.md` - Detailed relay module setup

- `docs/USB-TEMPERATURE-HUMIDITY-SENSORS.md` - Sensor configuration

- `docs/WINDOW-AC-TESTING.md` - AC unit testing procedures

- `scripts/relay-server.js` - Backend relay control script

- `src/lib/webSerialRelay.js` - Web Serial API implementation

### Helpful Links

- Web Serial API Documentation

- CH340 Driver Downloads

- DS18B20 Datasheet

- HVAC Wiring Standards

---

## 🎉 You're Ready to Build!

All your parts are compatible and the software already supports them. Follow this guide step-by-step, and you'll have a working smart thermostat!

### Safety Reminder 🚨

- Work safely with electricity

- When in doubt, consult a licensed electrician

- Never work on live circuits

- Use proper tools and safety equipment

**Questions?** Check the troubleshooting section or review the additional documentation files.

---

**Document Version:** 2.0

**Last Updated:** 2025

**Compatibility:** Web Serial API, CH340 Relay, DS18B20 Sensor
