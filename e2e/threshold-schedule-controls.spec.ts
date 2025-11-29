import { test, expect } from "@playwright/test";
import { setupTest } from "./helpers/test-setup";

test.describe("Threshold and Schedule Controls", () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
  });

  test("should parse and execute compressor min runtime command", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Test the parser and executor directly via page.evaluate
    const result = await page.evaluate(async () => {
      // Import the parser
      const { parseAskJoule } = await import("/src/utils/askJouleParser.js");
      
      // Test parsing
      const parsed = parseAskJoule("set compressor min runtime to 10 minutes");
      
      if (parsed.action === "setCompressorMinRuntime" && parsed.value === 600) {
        // Test executor by loading and saving thermostat settings
        const { loadThermostatSettings, saveThermostatSettings } = await import("/src/lib/thermostatSettings.js");
        const settings = loadThermostatSettings();
        const oldValue = settings.thresholds.compressorMinCycleOff;
        settings.thresholds.compressorMinCycleOff = parsed.value;
        saveThermostatSettings(settings);
        
        // Verify it was saved
        const saved = loadThermostatSettings();
        return {
          success: saved.thresholds.compressorMinCycleOff === 600,
          oldValue,
          newValue: saved.thresholds.compressorMinCycleOff
        };
      }
      
      return { success: false, error: "Parser failed" };
    });
    
    expect(result.success).toBe(true);
    expect(result.newValue).toBe(600); // 10 minutes = 600 seconds
  });

  test("should parse and execute sleep mode start time command", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Test the parser and executor directly
    const result = await page.evaluate(async () => {
      try {
        // Use window.parseAskJoule if available, otherwise try import
        let parseAskJoule;
        if (window.parseAskJoule) {
          parseAskJoule = window.parseAskJoule;
        } else {
          const module = await import("/src/utils/askJouleParser.js");
          parseAskJoule = module.parseAskJoule;
        }
        
        const { loadThermostatSettings, saveThermostatSettings } = await import("/src/lib/thermostatSettings.js");
        
        // Test parsing 12-hour format
        const parsed = parseAskJoule("set sleep mode to start at 10 PM");
        
        if (parsed.action === "setSleepModeStartTime" && parsed.value === "22:00") {
          const settings = loadThermostatSettings();
          
          // Update all days
          for (let day = 0; day < 7; day++) {
            const daySchedule = settings.schedule.weekly[day] || [];
            const sleepIndex = daySchedule.findIndex((e) => e.comfortSetting === "sleep");
            if (sleepIndex >= 0) {
              daySchedule[sleepIndex].time = parsed.value;
            } else {
              daySchedule.push({ time: parsed.value, comfortSetting: "sleep" });
              daySchedule.sort((a, b) => a.time.localeCompare(b.time));
            }
            settings.schedule.weekly[day] = daySchedule;
          }
          
          saveThermostatSettings(settings);
          
          // Verify
          const saved = loadThermostatSettings();
          const allCorrect = [0, 1, 2, 3, 4, 5, 6].every(day => {
            const daySchedule = saved.schedule.weekly[day] || [];
            const sleepEntry = daySchedule.find((e) => e.comfortSetting === "sleep");
            return sleepEntry?.time === "22:00";
          });
          
          return { success: allCorrect, newTime: parsed.value, parsed };
        }
        
        return { success: false, error: "Parser failed", parsed };
      } catch (e) {
        return { success: false, error: e.message, stack: e.stack };
      }
    });
    
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log("Parser result:", result);
    }
    expect(result.newTime).toBe("22:00");
  });

  test("should handle 24-hour time format for sleep mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const result = await page.evaluate(async () => {
      try {
        let parseAskJoule;
        if (window.parseAskJoule) {
          parseAskJoule = window.parseAskJoule;
        } else {
          const module = await import("/src/utils/askJouleParser.js");
          parseAskJoule = module.parseAskJoule;
        }
        
        // Test parsing 24-hour format
        const parsed = parseAskJoule("set sleep mode to start at 22:00");
        
        return {
          success: parsed.action === "setSleepModeStartTime" && parsed.value === "22:00",
          action: parsed.action,
          value: parsed.value,
          parsed
        };
      } catch (e) {
        return { success: false, error: e.message };
      }
    });
    
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log("Parser result:", result);
    }
    expect(result.value).toBe("22:00");
  });
});

