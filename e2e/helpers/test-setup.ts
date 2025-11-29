// e2e/helpers/test-setup.ts
// Shared setup for Playwright E2E tests

export async function bypassOnboarding(page: any) {
  await page.addInitScript(() => {
    // Terms acceptance - MUST be set before page loads
    localStorage.setItem("engineering_suite_terms_accepted", "true");
    localStorage.setItem("engineering_suite_terms_accepted_version", "1.0");

    // Onboarding completion - MUST be set before page loads
    localStorage.setItem("hasCompletedOnboarding", "true");
    localStorage.setItem("onboarded", "true");

    // Safety acknowledgments
    localStorage.setItem("chargingCalc_safetyAcknowledged", "true");
    localStorage.setItem("acknowledgedSafetyNotice", "true");
    
    // Bypass splash screen by setting a test flag
    // This will be checked in App.jsx to skip the splash
    (window as any).__TEST_MODE__ = true;
    (window as any).__SKIP_SPLASH__ = true;

    // Default user settings to avoid incomplete data
    const defaultSettings = {
      capacity: 24,
      efficiency: 15,
      winterThermostat: 70,
      summerThermostat: 74,
      useDetailedAnnualEstimate: false,
      utilityCost: 0.1,
      gasCost: 1.2,
      primarySystem: "heatPump",
      afue: 0.95,
      squareFeet: 1500,
      insulationLevel: 0.65,
      homeShape: 0.9,
      ceilingHeight: 8,
      homeElevation: 0,
      energyMode: "heating",
      solarExposure: 1.0,
      coolingSystem: "heatPump",
      coolingCapacity: 36,
      hspf2: 9.0,
      useElectricAuxHeat: true,
      tons: 3,
      compressorPower: 6,
      seer2: 15,
    };
    localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
  });
}

export async function acceptTermsIfPresent(page: any) {
  // Attempt to accept terms modal if it appears — tests may clear localStorage which triggers this
  try {
    // Wait for the overlay root (if present) then click checkbox and Accept button inside it
    const overlay = page.locator(".fixed.inset-0");
    if (await overlay.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Try a scoped checkbox first; otherwise click any checkbox on the page (best-effort)
      const scopedChk = overlay.locator('input[type="checkbox"]');
      if (await scopedChk.count()) {
        await scopedChk.first().click({ force: true });
      } else {
        const anyChk = page.locator('input[type="checkbox"]');
        if (await anyChk.count()) {
          await anyChk.first().click({ force: true });
        } else {
          // Try clicking label with acceptance text
          const acceptLabel = page.getByText(
            /I have read and understand|I acknowledge|I understand/i
          );
          if (
            await acceptLabel.isVisible({ timeout: 2000 }).catch(() => false)
          ) {
            await acceptLabel.first().click({ force: true });
          }
        }
      }
      // Attempt to click any Accept button on the page
      const acceptBtn = page.getByRole("button", { name: /accept/i });
      if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await acceptBtn.first().click();
        await page
          .waitForSelector(".fixed.inset-0", { state: "hidden", timeout: 8000 })
          .catch(() => {});
      }
    }
  } catch (e) {
    // no-op
  }
}

export async function setupTest(page: any, context?: any) {
  await bypassOnboarding(page);

  // Mock Web Bluetooth API if context is provided
  if (context) {
    await mockBluetoothAPI(context);
  }
}

export async function ensureUIUnblocked(page: any) {
  // Wait for page to load
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle").catch(() => {}); // Don't fail if networkidle times out
  
  // Force skip splash screen via window variable
  await page.evaluate(() => {
    (window as any).__SKIP_SPLASH__ = true;
  });

  // Wait a bit for React to start mounting
  await page.waitForTimeout(500);

  // Try to accept terms if modal appears
  await acceptTermsIfPresent(page);

  // Wait for any overlays to disappear
  try {
    // Check if body is hidden (common when modals block UI)
    const bodyHidden = await page.evaluate(() => {
      const body = document.body;
      return body.style.display === "none" || body.style.visibility === "hidden" || body.classList.contains("hidden");
    });

    if (bodyHidden) {
      // Try to find and close any blocking modals
      const modalCloseButtons = page.locator('button[aria-label*="close" i], button[aria-label*="accept" i], .fixed.inset-0 button');
      const count = await modalCloseButtons.count();
      if (count > 0) {
        await modalCloseButtons.first().click({ force: true, timeout: 2000 }).catch(() => {});
      }
    }

    // Wait for any fixed overlays to disappear (but not the main app overlay)
    const blockingOverlay = page.locator(".fixed.inset-0").filter({ hasNot: page.locator("main") });
    if (await blockingOverlay.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Try clicking accept button
      const acceptBtn = page.getByRole("button", { name: /accept|continue|close/i });
      if (await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await acceptBtn.first().click({ force: true });
        await page.waitForTimeout(500);
      }
    }

    // Ensure body is visible
    await page.evaluate(() => {
      document.body.style.display = "";
      document.body.style.visibility = "";
      document.body.classList.remove("hidden");
    });
  } catch (e) {
    // Ignore errors - continue anyway
  }

  // Wait for React to mount - check for root element first
  try {
    // Wait for React root to exist
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return root && root.children.length > 0;
      },
      { timeout: 10000 }
    );
  } catch (e) {
    console.log("React root not found, continuing anyway...");
  }

  // Wait for React to render content - check for main content area or header
  try {
    // Wait for either main content or header (which should always be visible)
    await Promise.race([
      page.waitForSelector("main", { timeout: 15000, state: "visible" }).catch(() => null),
      page.waitForSelector("header", { timeout: 15000, state: "visible" }).catch(() => null),
      page.waitForSelector("[role='main']", { timeout: 15000, state: "visible" }).catch(() => null),
      page.waitForSelector(".page-container", { timeout: 15000, state: "visible" }).catch(() => null),
      page.waitForSelector("h1", { timeout: 15000, state: "visible" }).catch(() => null),
      page.waitForSelector("[data-testid]", { timeout: 15000, state: "visible" }).catch(() => null),
      page.waitForSelector("nav", { timeout: 15000, state: "visible" }).catch(() => null),
    ]);
  } catch (e) {
    // If main content not found, wait a bit more and check what's actually on the page
    await page.waitForTimeout(3000);
    
    // Debug: log what's actually on the page
    const pageContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        hasRoot: !!root,
        rootChildren: root ? root.children.length : 0,
        bodyVisible: document.body.style.display !== "none",
        hasMain: !!document.querySelector("main"),
        hasHeader: !!document.querySelector("header"),
        hasH1: !!document.querySelector("h1"),
        hasNav: !!document.querySelector("nav"),
        url: window.location.href,
        bodyText: document.body.innerText.substring(0, 200),
        rootHTML: root ? root.innerHTML.substring(0, 500) : "no root",
      };
    });
    console.log("Page state after wait:", JSON.stringify(pageContent, null, 2));
  }

  // Additional wait for React hydration
  await page.waitForTimeout(1000);
}

export async function mockBluetoothAPI(context: any) {
  await context.addInitScript(() => {
    (window as any).navigator.bluetooth = {
      requestDevice: async (options: any) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              name: "Fieldpiece SMAN360",
              gatt: {
                connected: false,
                connect: async () => {
                  return {
                    getPrimaryService: async (uuid: string) => {
                      return {
                        uuid,
                        getCharacteristic: async (charUuid: string) => {
                          return {
                            uuid: charUuid,
                            properties: { notify: true },
                            startNotifications: async () => {},
                            addEventListener: (event: string, handler: any) => {
                              setTimeout(() => {
                                const buffer = new ArrayBuffer(8);
                                const view = new DataView(buffer);
                                view.setFloat32(0, 335.0, true);
                                view.setFloat32(4, 120.0, true);
                                handler({ target: { value: view } });
                              }, 500);
                            },
                          };
                        },
                        getCharacteristics: async () => {
                          return [
                            {
                              properties: { notify: true },
                              startNotifications: async () => {},
                              addEventListener: () => {},
                            },
                          ];
                        },
                      };
                    },
                  };
                },
                disconnect: () => {},
              },
              addEventListener: () => {},
            });
          }, 100);
        });
      },
    };
  });
}
