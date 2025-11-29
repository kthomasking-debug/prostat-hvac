import { test, expect } from "@playwright/test";
import { setupTest, bypassOnboarding } from "./helpers/test-setup";

test.describe("Elevation Update", () => {
  test.beforeEach(async ({ page }) => {
    // Set initial location with elevation before page loads
    await page.addInitScript(() => {
      localStorage.setItem(
        "userLocation",
        JSON.stringify({
          city: "Blairsville",
          state: "Georgia",
          latitude: 34.688086,
          longitude: -82.408727,
          elevation: 1883,
        })
      );
      
      const userSettings = {
        capacity: 36,
        efficiency: 15,
        winterThermostat: 70,
        summerThermostat: 74,
        utilityCost: 0.1,
        gasCost: 1.2,
        primarySystem: "heatPump",
        squareFeet: 2000,
        insulationLevel: 0.65,
        homeShape: 0.9,
        ceilingHeight: 8,
        homeElevation: 1883, // Initial elevation
        energyMode: "heating",
        solarExposure: 1.0,
        coolingSystem: "heatPump",
        coolingCapacity: 36,
        hspf2: 9.0,
        useElectricAuxHeat: true,
      };
      localStorage.setItem("userSettings", JSON.stringify(userSettings));
      localStorage.setItem("hasCompletedOnboarding", "true");
    });
    
    // Setup test (bypasses onboarding) - but preserve elevation
    await setupTest(page);
    
    // Re-apply elevation after setupTest (which may have overwritten it)
    await page.addInitScript(() => {
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      userSettings.homeElevation = 1883;
      localStorage.setItem("userSettings", JSON.stringify(userSettings));
    });
  });

  test("should update elevation via Ask Joule and reflect in forecast section", async ({
    page,
  }) => {
    // Navigate to cost-forecaster page
    await page.goto("/cost-forecaster");
    await page.waitForLoadState("networkidle");
    
    // Wait for the page to be fully loaded - check for any visible content
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for forecast to load

    // Expand Daily Breakdown section to see elevation
    // Use the section ID or a more specific selector
    const dailyBreakdownSection = page.locator('#daily-breakdown-section');
    await expect(dailyBreakdownSection).toBeVisible({ timeout: 10000 });
    
    // Find the button inside the section
    const dailyBreakdownButton = dailyBreakdownSection.locator('button').first();
    await expect(dailyBreakdownButton).toBeVisible({ timeout: 5000 });
    await dailyBreakdownButton.click();
    await page.waitForTimeout(1500); // Wait for section to expand

    // Verify initial elevation is shown (check both location and home elevation)
    // The elevation is inside a div with data-testid="elevation-display" or in the text
    const elevationSection = page
      .locator('[data-testid="elevation-display"], [data-testid="home-elevation-value"]')
      .or(page.locator('text=/1,883.*ft/i'))
      .first();
    await expect(elevationSection).toBeVisible({ timeout: 5000 });

    // Open Ask Joule modal
    const askJouleButton = page.getByTestId("ask-joule-fab");
    await askJouleButton.click();
    await page.waitForTimeout(500);

    // Find the input field and submit elevation update
    const inputField = page.locator('input[type="text"], textarea').first();
    await inputField.fill("set home elevation to 10000");
    await inputField.press("Enter");

    // Wait for the response - the agent may take time to process
    await page.waitForTimeout(3000);

    // Check localStorage immediately to see if the command was executed
    const userSettingsAfterCommand = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("userSettings") || "{}");
    });
    console.log("UserSettings after command:", userSettingsAfterCommand);
    console.log("homeElevation after command:", userSettingsAfterCommand.homeElevation);

    // Verify the success message - check for various possible formats
    const successMessage = await page
      .locator('text=/✓.*elevation.*10000|Home elevation.*10000|elevation.*set.*10000|Setting home elevation.*10000/i')
      .first()
      .textContent({ timeout: 10000 })
      .catch(() => null);
    
    console.log("Success message:", successMessage);
    
    // Verify elevation was updated in localStorage
    if (userSettingsAfterCommand.homeElevation !== 10000) {
      throw new Error(`Elevation not updated in localStorage. Expected 10000, got ${userSettingsAfterCommand.homeElevation}`);
    }
    
    // Also verify success message if available
    if (successMessage && !successMessage.includes("10000")) {
      console.warn("Success message doesn't contain 10000, but elevation was updated in localStorage");
    }

    // Close Ask Joule modal
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

    // Reload page to see updated elevation
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Expand Daily Breakdown section again
    const dailyBreakdownButton2 = page
      .locator('button')
      .filter({ hasText: /Daily Breakdown/i })
      .first();
    await expect(dailyBreakdownButton2).toBeVisible({ timeout: 5000 });
    await dailyBreakdownButton2.click();
    await page.waitForTimeout(1000); // Wait for section to expand

    // Wait for the elevation display to load and update
    await page.waitForSelector('[data-testid="elevation-display"]', {
      timeout: 10000,
    });
    
    // Wait for the elevation value to update - use waitForFunction to check the actual value
    await page.waitForFunction(
      () => {
        const elevationValue = document.querySelector('[data-testid="home-elevation-value"]');
        if (!elevationValue) return false;
        const text = elevationValue.textContent || '';
        return text.includes('10,000') || text.includes('10000');
      },
      { timeout: 10000 }
    );
    
    // Wait a bit more for the component to fully render
    await page.waitForTimeout(1000);

    // Verify the elevation is updated in the forecast section
    // Check for the updated elevation value (10,000 ft) in the elevation display
    const elevationDisplay = page.locator('[data-testid="elevation-display"]');
    await expect(elevationDisplay).toBeVisible({ timeout: 5000 });
    
    // Get the full text content of the elevation display
    const elevationText = await elevationDisplay.textContent();
    console.log("Elevation display text:", elevationText);
    
    // Check that it contains 10,000 (the home elevation)
    expect(elevationText).toMatch(/Home Elevation.*10,000.*ft/i);
    
    // Also check the specific home elevation value element
    const homeElevationValue = page.locator('[data-testid="home-elevation-value"]');
    if (await homeElevationValue.count() > 0) {
      const valueText = await homeElevationValue.textContent();
      console.log("Home elevation value text:", valueText);
      expect(valueText).toMatch(/10,000|10000/i);
    }

    // Also verify it's stored in localStorage
    const userSettings = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("userSettings") || "{}");
    });
    expect(userSettings.homeElevation).toBe(10000);
  });

  test("should update elevation directly via localStorage and reflect in UI", async ({
    page,
  }) => {
    // Navigate to cost-forecaster page
    await page.goto("/cost-forecaster");
    await page.waitForLoadState("networkidle");

    // Update elevation directly in localStorage
    await page.evaluate(() => {
      const userSettings = JSON.parse(
        localStorage.getItem("userSettings") || "{}"
      );
      userSettings.homeElevation = 10000;
      localStorage.setItem("userSettings", JSON.stringify(userSettings));
      
      // Trigger custom event to notify components (storage event only fires for cross-tab)
      window.dispatchEvent(new CustomEvent("userSettingsUpdated"));
    });
    
    // Wait a bit for the event to be processed
    await page.waitForTimeout(500);

    // Reload the page to see the update
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Expand the Daily Breakdown section
    const dailyBreakdownButton = page
      .locator('button')
      .filter({ hasText: /Daily Breakdown/i })
      .first();
    await expect(dailyBreakdownButton).toBeVisible({ timeout: 5000 });
    await dailyBreakdownButton.click();
    await page.waitForTimeout(1000); // Wait for section to expand

    // Wait for the elevation display to appear
    await page.waitForSelector('[data-testid="elevation-display"], [data-testid="home-elevation-value"]', {
      timeout: 10000,
    });

    // Verify the elevation is updated - check for either format
    const updatedElevationSection = page
      .locator('[data-testid="home-elevation-value"]')
      .or(page.locator('text=/10,000|10000'))
      .first();
    await expect(updatedElevationSection).toBeVisible({ timeout: 5000 });
    
    // Also verify in localStorage
    const userSettings = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("userSettings") || "{}");
    });
    expect(userSettings.homeElevation).toBe(10000);
  });

  test("should show both location and home elevation when different", async ({
    page,
  }) => {
    // Set different elevations - location elevation stays at 1883, home elevation is 10000
    // This is done in beforeEach, but we need to ensure homeElevation is 10000
    await page.addInitScript(() => {
      // Preserve location elevation (1883)
      const userLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");
      userLocation.elevation = 1883;
      localStorage.setItem("userLocation", JSON.stringify(userLocation));
      
      // Set home elevation to 10000
      const userSettings = JSON.parse(
        localStorage.getItem("userSettings") || "{}"
      );
      userSettings.homeElevation = 10000;
      localStorage.setItem("userSettings", JSON.stringify(userSettings));
    });

    // Navigate to cost-forecaster page
    await page.goto("/cost-forecaster");
    await page.waitForLoadState("networkidle");

    // Expand the Daily Breakdown section
    const dailyBreakdownButton = page
      .locator('button')
      .filter({ hasText: /Daily Breakdown/i })
      .first();
    await expect(dailyBreakdownButton).toBeVisible({ timeout: 5000 });
    await dailyBreakdownButton.click();
    await page.waitForTimeout(1000); // Wait for section to expand

    // Wait for the elevation display to appear
    await page.waitForSelector('[data-testid="elevation-display"]', {
      timeout: 10000,
    });

    // Verify both elevations are shown
    const elevationDisplay = page.locator('[data-testid="elevation-display"]');
    await expect(elevationDisplay).toBeVisible({ timeout: 5000 });
    
    // Check that the text contains both elevations
    const elevationText = await elevationDisplay.textContent();
    expect(elevationText).toMatch(/Location Elevation.*1,883.*ft/i);
    expect(elevationText).toMatch(/Home Elevation.*10,000.*ft/i);

    // Verify temperature adjustment note is shown (8,117 ft difference = 10000 - 1883)
    const adjustmentNote = page.locator(
      'text=/Temps adjusted.*8,117.*ft difference|Temps adjusted.*difference/i'
    );
    await expect(adjustmentNote.first()).toBeVisible({ timeout: 5000 });
  });
});

