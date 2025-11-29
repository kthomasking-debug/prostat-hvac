# Build Guide: Using Your eBay Parts

## ✅ Parts Compatibility Analysis

### What You Have (All Compatible!)

| Part                              | Status          | Notes                             |
| --------------------------------- | --------------- | --------------------------------- |
| **Wall Mounted Mobile AC L-2008** | ✅ Perfect      | This is your HVAC unit to control |
| **DS18B20 USB Thermometer**       | ✅ Perfect      | Works with Web Serial API         |
| **CH340 8CH USB Relay Module**    | ✅ Perfect      | Already supported in codebase     |
| **Onn. Surf 7" Tablet**           | ✅ Perfect      | Android tablet for display        |
| **24VAC to 12VDC Converter**      | ✅ Needed       | Powers relay module               |
| **24VAC to 5VDC USB Converter**   | ✅ Needed       | Powers tablet via USB             |
| **USB Cables/Adapters**           | ✅ Needed       | For connections                   |
| **Tablet Wall Mount**             | ✅ Nice to have | For mounting                      |

### What's Missing (Optional but Recommended)

- **USB Hub** (if connecting both relay + sensor to tablet)
- **Wire nuts / electrical connectors** (for safe wiring)
- **18-22 AWG wire** (for low-voltage connections)
- **Electrical tape** (for safety)

---

## 🔌 Complete Wiring Diagram

### Power Distribution

```
Furnace/AC Transformer (24VAC)
    │
    ├─→ 24VAC to 12VDC Converter ──→ Relay Module Power (12VDC)
    │
    └─→ 24VAC to 5VDC USB Converter ──→ Tablet USB-C (5VDC, 3A)
```

### Control Wiring

```
Relay Module (CH340)          Wall AC Unit
───────────────────          ──────────────
Relay 1 (NO)  ────→  Power Control (see below)
Relay 2 (NO)  ────→  (Reserved for future)
Relay 3 (NO)  ────→  (Reserved for future)
Common (C)    ────→  Common/Neutral
```

### USB Connections

```
Tablet (USB-C)
    │
    ├─→ USB-C to USB-A OTG Adapter
    │       │
    │       ├─→ USB Hub (if needed)
    │       │       │
    │       │       ├─→ USB-B to USB-A Cable ──→ Relay Module (USB-B)
    │       │       │
    │       │       └─→ USB-A Cable ──→ DS18B20 Thermometer (USB-A)
    │       │
    │       └─→ (Direct connection if no hub)
```

---

## 📋 Step-by-Step Setup

### Step 1: Power Supply Setup

**For Relay Module:**

1. Connect **24VAC to 12VDC converter** to your furnace/AC transformer:

   - Input: Connect to 24VAC transformer (R and C terminals)
   - Output: Connect to relay module's power terminals (check module for +12V and GND)

2. **Important:** The relay module needs external power even when connected via USB!

**For Tablet:**

1. Connect **24VAC to 5VDC USB converter** to transformer:

   - Input: Connect to 24VAC transformer (same R and C terminals)
   - Output: USB-C connector → Connect to tablet

2. This will power the tablet continuously (no battery needed!)

### Step 2: USB Connections

**Option A: Direct Connection (One Device at a Time)**

- Connect relay module OR temperature sensor (not both simultaneously)
- Use USB-C to USB-A OTG adapter
- Then USB-A to USB-B cable for relay, or USB-A cable for sensor

**Option B: USB Hub (Recommended for Both Devices)**

- Connect USB hub to tablet via OTG adapter
- Connect relay module to hub (USB-B to USB-A cable)
- Connect temperature sensor to hub (USB-A cable)

**Note:** The Onn. Surf tablet may have limited USB OTG power. A powered USB hub is recommended if you have issues.

### Step 3: AC Unit Control Wiring

**⚠️ SAFETY FIRST: Unplug AC unit before wiring!**

**For Wall-Mounted Mobile AC L-2008:**

This unit likely has:

- Power cord (120VAC)
- Control board
- Compressor
- Fan

**Option 1: Control Power to Entire Unit (Safest)**

1. Use relay to control the AC's power supply
2. Wire relay in series with the hot wire (120VAC)
3. When relay closes → AC gets power → runs
4. When relay opens → AC loses power → stops

**Wiring:**

```
Wall Outlet (120VAC)
    │
    ├─ Hot Wire ──→ Relay 1 (NO terminal)
    │                   │
    │                   └─→ Hot Wire ──→ AC Unit Power Cord
    │
    └─ Neutral Wire ───────────────────→ AC Unit Power Cord
```

**⚠️ Important:**

- Your relay module is rated for **10A @ 250VAC**
- Check your AC unit's amperage rating (usually 5-15A)
- **If AC draws more than 10A, you need a contactor (heavy-duty relay)**

**Option 2: Control via AC's Control Board (Advanced)**

If the AC unit has low-voltage control terminals (like a furnace), you can control it directly. Check the AC unit's manual for control board access.

### Step 4: Temperature Sensor Placement

1. **Mount DS18B20 sensor** in a location that represents room temperature:

   - Away from direct sunlight
   - Away from AC vents
   - At average room height (4-5 feet)
   - Not near heat sources

2. **Connect USB cable** from sensor to tablet (via hub if using)

3. The sensor sends temperature data automatically every 10 seconds in ASCII format (e.g., "+25.3C")

---

## 💻 Software Configuration

### Step 1: Enable Web Serial API Support

Your codebase already supports this! Just ensure:

1. **Tablet Browser:** Use Chrome or Edge (Web Serial API support)
2. **Permissions:** Grant serial port access when prompted

### Step 2: Configure Relay Module

The CH340 relay module uses **AT commands**. Your codebase already supports this!

**In your React app:**

```javascript
import { getWebSerialRelay } from "../lib/webSerialRelay";

const relay = getWebSerialRelay();
await relay.connect();

// Use 'at' command format for CH340 modules
await relay.toggleTerminal("W", true, "at"); // Turn on Heat
await relay.toggleTerminal("Y", true, "at"); // Turn on Cool
await relay.toggleTerminal("G", true, "at"); // Turn on Fan
```

**Relay Mapping:**

- Relay 1 → W (Heat) - or AC Power Control
- Relay 2 → Y (Cool) - reserved
- Relay 3 → G (Fan) - reserved

### Step 3: Configure Temperature Sensor

The DS18B20 USB thermometer works with Web Serial API:

```javascript
// The sensor sends data automatically every 10 seconds
// Format: "+25.3C" or "-5.2C"

// Your codebase has support for this in:
// - docs/USB-TEMPERATURE-HUMIDITY-SENSORS.md
// - scripts/relay-server.js (for server-side)
```

**Integration Example:**

```javascript
// Connect to sensor
const port = await navigator.serial.requestPort();
await port.open({ baudRate: 9600 });

const reader = port.readable.getReader();
const decoder = new TextDecoder();

// Read temperature data
const { value } = await reader.read();
const data = decoder.decode(value).trim(); // e.g., "+25.3C"
const tempC = parseFloat(data.replace("C", ""));
const tempF = (tempC * 9) / 5 + 32;
```

---

## 🧪 Testing Procedure

### Test 1: USB Connections

1. **Connect relay module** to tablet
2. Open Chrome/Edge on tablet
3. Navigate to your app
4. Go to "Contactor Demo" or "Short Cycle Test" page
5. Click "Connect Relay"
6. Grant serial port permission
7. Verify connection status shows "Connected"

### Test 2: Relay Control

1. With relay connected, toggle relays on/off
2. **Listen for relay clicks** (mechanical relays make an audible click)
3. **Check LED indicators** on relay module (if present)
4. Use multimeter to verify relay contacts are closing

### Test 3: Temperature Sensor

1. **Connect DS18B20 sensor** to tablet
2. Open serial port to sensor
3. Wait 10 seconds for first reading
4. Verify temperature data appears (format: "+25.3C")
5. Compare with room thermometer

### Test 4: AC Unit Control

**⚠️ SAFETY: Have someone watch the AC unit during testing!**

1. **Wire relay to AC power** (see Step 3 above)
2. **Set AC unit's built-in thermostat to coldest** (or bypass it)
3. **Connect relay module** to tablet
4. **Turn on relay** via app
5. **Verify AC unit starts** (compressor and fan should run)
6. **Turn off relay** via app
7. **Verify AC unit stops**

### Test 5: Full Thermostat Control

1. **Connect both relay and sensor** to tablet (via USB hub)
2. **Set target temperature** in app (e.g., 72°F)
3. **Let system run automatically:**
   - When room temp > target + differential → AC turns on
   - When room temp < target - differential → AC turns off
4. **Monitor for 30 minutes** to verify proper cycling

---

## ⚠️ Important Safety Notes

### Electrical Safety

1. **Always unplug AC unit** before wiring
2. **Use proper wire gauge** (18-22 AWG for low voltage, 14-16 AWG for 120VAC)
3. **Use wire nuts** for connections (don't just twist wires)
4. **Wrap connections in electrical tape** for safety
5. **Test with multimeter** before powering on
6. **Check relay rating** (10A max) vs AC unit amperage

### Power Considerations

1. **Relay module needs external power** (12VDC from converter)
2. **Tablet needs power** (5VDC USB from converter)
3. **Both converters need 24VAC input** (from furnace/AC transformer)
4. **If transformer can't handle load**, use separate 24VAC transformer

### AC Unit Compatibility

**Wall-Mounted Mobile AC L-2008 Specifications:**

- Check the unit's power rating (watts/amperage)
- Verify relay can handle the load (10A @ 250VAC)
- If unit draws more than 10A, use a contactor (heavy-duty relay)

---

## 🔧 Troubleshooting

### Relay Module Not Detected

**Symptoms:** Tablet doesn't see relay module

**Solutions:**

- Check USB cable connections
- Try different USB cable
- Check USB OTG is enabled in tablet settings
- Try connecting to computer first to verify module works
- Check relay module has external power (12VDC)

### Temperature Sensor Not Reading

**Symptoms:** No temperature data

**Solutions:**

- Wait 10 seconds (sensor updates every 10s)
- Check USB connection
- Verify baud rate is 9600
- Check sensor is sending data (use serial monitor)
- Try different USB port

### AC Unit Not Responding

**Symptoms:** Relay clicks but AC doesn't start

**Solutions:**

- Check wiring connections
- Verify relay contacts are closing (use multimeter)
- Check AC unit's built-in thermostat (set to coldest)
- Verify AC unit has power (check outlet)
- Check relay rating vs AC unit amperage

### Tablet Power Issues

**Symptoms:** Tablet battery drains or won't charge

**Solutions:**

- Verify 24VAC to 5VDC converter is working
- Check converter output (should be 5V, 3A)
- Try different USB-C cable
- Check tablet charging port for damage
- Use powered USB hub if needed

---

## 📊 Cost Summary

| Item                        | Your Cost | Status       |
| --------------------------- | --------- | ------------ |
| Wall AC Unit                | $59.80    | ✅ Have      |
| DS18B20 Thermometer         | $35.00    | ✅ Have      |
| CH340 Relay Module          | $16.41    | ✅ Have      |
| Tablet                      | $45.00    | ✅ Have      |
| 24VAC to 12VDC Converter    | $18.99    | ✅ Have      |
| 24VAC to 5VDC USB Converter | $22.00    | ✅ Have      |
| USB Cables/Adapters         | ~$9.00    | ✅ Have      |
| Tablet Mount                | $11.98    | ✅ Have      |
| **Total**                   | **~$218** | ✅ Complete! |

**Optional Additions:**

- USB Hub (powered): ~$15-25
- Wire/Connectors: ~$10-20
- Contactor (if AC > 10A): ~$20-40

---

## ✅ Final Checklist

Before powering on:

- [ ] All wiring connections secure
- [ ] Wire nuts properly installed
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

---

## 🎯 Next Steps

1. **Complete wiring** following this guide
2. **Test each component** individually
3. **Test full system** integration
4. **Calibrate temperature sensor** (compare with known good thermometer)
5. **Tune thermostat settings** (differential, min on/off times)
6. **Monitor for 24-48 hours** to verify stability

---

## 📚 Additional Resources

- **CH340 Relay Setup:** `docs/CH340-RELAY-SETUP.md`
- **Temperature Sensors:** `docs/USB-TEMPERATURE-HUMIDITY-SENSORS.md`
- **Window AC Testing:** `docs/WINDOW-AC-TESTING.md`
- **Relay Server:** `scripts/relay-server.js`
- **Web Serial Relay:** `src/lib/webSerialRelay.js`

---

## 🎉 You're Ready to Build!

All your parts are compatible and the software already supports them. Follow this guide step-by-step, and you'll have a working smart thermostat!

**Questions?** Check the troubleshooting section or review the additional documentation files.
