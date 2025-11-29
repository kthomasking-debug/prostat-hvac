# Threshold and Schedule Controls Implementation

## ✅ Completed

### 1. Threshold Controls (Compressor Min Runtime)
- **Parser Rules Added**: 
  - "set compressor min runtime to X minutes" → converts to seconds
  - "set compressor min runtime to X seconds" → uses seconds directly
- **Executor Case**: `setCompressorMinRuntime`
  - Updates `thermostatSettings.thresholds.compressorMinCycleOff`
  - Saves to localStorage
  - Logs to audit log
- **Test Status**: ✅ Passing

### 2. Schedule Controls (Sleep Mode Start Time)
- **Parser Rules Added**:
  - "set sleep mode to start at 10 PM" (12-hour format)
  - "set sleep mode to start at 22:00" (24-hour format)
  - Supports both AM/PM and 24-hour formats
- **Executor Case**: `setSleepModeStartTime`
  - Updates sleep mode start time for all 7 days of the week
  - Saves to localStorage
  - Logs to audit log
  - Formats time for display (12-hour format)
- **Test Status**: ⚠️ Parser working, test needs adjustment for Playwright environment

### 3. Audit Log Integration
- All threshold and schedule changes are logged to the audit log
- Uses `onSettingChange` callback with special key format: `thermostat.thresholds.*` and `thermostat.schedule.*`
- Tracks old values for undo functionality

## Implementation Details

### Parser Location
- `src/utils/askJouleParser.js` - `parseCommandLocal` function
- Patterns added after dark mode controls (line ~250)

### Executor Location
- `src/components/AskJoule.jsx` - `handleCommand` function
- Cases added after dark mode toggle (line ~910)

### Settings Storage
- Thresholds: `localStorage.thermostatSettings.thresholds.compressorMinCycleOff` (in seconds)
- Schedule: `localStorage.thermostatSettings.schedule.weekly[0-6]` (array of schedule entries)

## Usage Examples

### Compressor Min Runtime
- "set compressor min runtime to 10 minutes" → 600 seconds
- "set compressor min runtime to 300 seconds" → 300 seconds
- "set compressor min cycle off to 5 minutes" → 300 seconds

### Sleep Mode Start Time
- "set sleep mode to start at 10 PM" → 22:00
- "set sleep mode to start at 10:00 PM" → 22:00
- "set sleep mode to start at 22:00" → 22:00
- "set sleep mode begins at 9 PM" → 21:00

## Testing

### Manual Testing
1. Open Ask Joule
2. Try: "set compressor min runtime to 10 minutes"
3. Verify: Check `localStorage.thermostatSettings.thresholds.compressorMinCycleOff` = 600
4. Try: "set sleep mode to start at 10 PM"
5. Verify: Check `localStorage.thermostatSettings.schedule.weekly[0-6]` all have sleep entry at 22:00

### Automated Testing
- `e2e/threshold-schedule-controls.spec.ts`
- Compressor runtime test: ✅ Passing
- Sleep mode tests: ⚠️ Need Playwright environment adjustment (parser works, import issue in test)

## Next Steps

1. Fix Playwright test imports for sleep mode tests
2. Add validation for compressor runtime (e.g., min 60 seconds, max 1800 seconds)
3. Add more schedule controls (e.g., "set home mode to start at 6 AM")
4. Add threshold controls for other settings (e.g., aux heat max outdoor temp)

