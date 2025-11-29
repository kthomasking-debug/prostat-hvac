// src/data/welcomeThemes.js
// Welcome/onboarding theme definitions

/**
 * Welcome screen theme options
 * Used in onboarding and dashboard customization
 */
export const WELCOME_THEMES = {
  winter: {
    file: "images/welcome/winter-wonderland.png",
    label: "Winter Wonderland",
  },
  waterfall: {
    file: "images/welcome/waterfall.png",
    label: "Waterfall",
  },
  bear: {
    file: "images/welcome/bear-setting-thermostat.png",
    label: "Bear Setting Thermostat",
  },
  custom: {
    file: null,
    label: "Custom Image",
  },
};

/**
 * Get theme by key with fallback
 * @param {string} themeKey - Theme identifier
 * @returns {Object} Theme configuration
 */
export function getWelcomeTheme(themeKey) {
  if (WELCOME_THEMES[themeKey]) {
    return WELCOME_THEMES[themeKey];
  }
  // Fallback to first available theme
  const firstKey = Object.keys(WELCOME_THEMES)[0];
  return WELCOME_THEMES[firstKey];
}

/**
 * Get all available theme keys (excluding custom)
 * @returns {string[]} Array of theme keys
 */
export function getAvailableThemeKeys() {
  return Object.keys(WELCOME_THEMES).filter(key => key !== 'custom');
}

export default WELCOME_THEMES;




