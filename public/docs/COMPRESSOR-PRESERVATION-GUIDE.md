# Compressor Preservation Guide: Heat Differential Setting

## The "Compressor Preservation" Standard

The industry standard for preventing damage isn't about temperature differential directly; it's about **Cycles Per Hour (CPH)** and **Minimum Run Time**.

### NEMA MG-1 Rule

Electric motors (like compressors) overheat if started too often. The inrush current melts the windings.

**The Limit:** Maximum 4-6 starts per hour. (i.e., a start every 10-15 minutes).

### The "Differential" Math

- **If your differential is 0.5°F** (Ecobee default), a drafty house will cycle ON/OFF every 5 minutes. **(12 cycles/hour = Death to Compressor)**.
- **If your differential is 1.5°F**, the run time extends to 15 minutes. **(4 cycles/hour = Safe)**.

## How ProStat's "Hardware Protection Mode" Works

ProStat doesn't just set a static differential. It makes it **Dynamic**.

### The Algorithm

1. **Count Cycles:** Track how many times the heat turned on in the last 60 minutes.
2. **The Throttle:**
   - If Cycles < 3: Keep differential tight (0.5°F) for maximum comfort.
   - If Cycles > 4: Widen Differential to 1.0°F automatically.
   - If Cycles > 6: Emergency Widen to 2.0°F and alert user ("System Short Cycling! Check Filter/Sizing").

### The Value Proposition

"ProStat auto-tunes your differential to keep your compressor within NEMA safety limits. Ecobee just lets it burn."

This is the **$129 feature**. You are selling **"Compressor Insurance"**.

## Recommended Settings Based on Cycles Per Hour

| Cycles Per Hour | Recommended Differential | Status |
|----------------|-------------------------|--------|
| < 3 cycles/hour | 0.5°F | Optimal - Maximum comfort |
| 3-4 cycles/hour | 0.5-1.0°F | Good - Normal operation |
| 4-6 cycles/hour | 1.0-1.5°F | Warning - Widen differential |
| > 6 cycles/hour | 2.0°F+ | Critical - Check system sizing/filter |

## How to Use the "Auto" Button

The "Auto" button analyzes your uploaded CSV data from the System Performance Analyzer to:

1. Calculate actual cycles per hour from your thermostat data
2. Determine the optimal differential based on NEMA MG-1 safety limits
3. Automatically set the differential to protect your compressor

**Note:** You must upload CSV data in the System Performance Analyzer first for the Auto button to work.

## References

- **NEMA MG-1:** Standard for motor starting frequency limits
- **ASHRAE Standard 55:** Thermal comfort conditions for human occupancy
- **Manufacturer Guidelines:** Most HVAC manufacturers recommend 4-6 cycles per hour maximum

