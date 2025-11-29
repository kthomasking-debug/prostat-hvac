// src/utils/routes.js
// Centralized route definitions for the application

/**
 * Application route paths
 * Single source of truth for all navigation paths
 */
export const ROUTES = {
  // Main pages
  HOME: "/",
  FORECAST: "/cost-forecaster",
  COMPARISON: "/cost-comparison",
  BALANCE: "/energy-flow",
  CHARGING: "/charging-calculator",
  ANALYZER: "/performance-analyzer",
  METHODOLOGY: "/methodology",
  SETTINGS: "/settings",
  THERMOSTAT: "/thermostat-analyzer",
  BUDGET: "/monthly-budget",
  ROI: "/upgrade-roi",
  CONTACTOR_DEMO: "/contactor-demo",
};

/**
 * Route labels for display in UI
 */
export const ROUTE_LABELS = {
  [ROUTES.HOME]: "Home",
  [ROUTES.FORECAST]: "7-Day Cost Forecaster",
  [ROUTES.COMPARISON]: "System Comparison",
  [ROUTES.BALANCE]: "Balance Point Analyzer",
  [ROUTES.CHARGING]: "A/C Charging Calculator",
  [ROUTES.ANALYZER]: "Performance Analyzer",
  [ROUTES.METHODOLOGY]: "Calculation Methodology",
  [ROUTES.SETTINGS]: "Settings",
  [ROUTES.THERMOSTAT]: "Thermostat Strategy Analyzer",
  [ROUTES.BUDGET]: "Monthly Budget Planner",
  [ROUTES.ROI]: "Upgrade ROI Analyzer",
  [ROUTES.CONTACTOR_DEMO]: "Contactor Demo",
};

/**
 * Route mapping for Ask Joule navigation commands
 * Maps shorthand names to full route paths
 */
export const NAVIGATION_SHORTCUTS = {
  // Primary shortcuts
  forecast: ROUTES.FORECAST,
  forecaster: ROUTES.FORECAST,
  "7day": ROUTES.FORECAST,
  "7-day": ROUTES.FORECAST,

  comparison: ROUTES.COMPARISON,
  compare: ROUTES.COMPARISON,
  versus: ROUTES.COMPARISON,
  vs: ROUTES.COMPARISON,

  balance: ROUTES.BALANCE,
  flow: ROUTES.BALANCE,
  energy: ROUTES.BALANCE,

  charging: ROUTES.CHARGING,
  ac: ROUTES.CHARGING,
  refrigerant: ROUTES.CHARGING,

  analyzer: ROUTES.ANALYZER,
  performance: ROUTES.ANALYZER,
  analyze: ROUTES.ANALYZER,

  methodology: ROUTES.METHODOLOGY,
  math: ROUTES.METHODOLOGY,
  formulas: ROUTES.METHODOLOGY,

  settings: ROUTES.SETTINGS,
  preferences: ROUTES.SETTINGS,
  config: ROUTES.SETTINGS,

  thermostat: ROUTES.THERMOSTAT,
  setback: ROUTES.THERMOSTAT,
  schedule: ROUTES.THERMOSTAT,

  budget: ROUTES.BUDGET,
  monthly: ROUTES.BUDGET,
  planner: ROUTES.BUDGET,

  roi: ROUTES.ROI,
  upgrade: ROUTES.ROI,
  payback: ROUTES.ROI,

  contactor: ROUTES.CONTACTOR_DEMO,
  demo: ROUTES.CONTACTOR_DEMO,
  hardware: ROUTES.CONTACTOR_DEMO,

  home: ROUTES.HOME,
  main: ROUTES.HOME,
  dashboard: ROUTES.HOME,
};

/**
 * Get route path from shortcut name
 * @param {string} shortcut - Navigation shortcut
 * @returns {string|null} Route path or null if not found
 */
export function getRouteFromShortcut(shortcut) {
  if (!shortcut) return null;
  const normalized = shortcut.toLowerCase().trim();
  return NAVIGATION_SHORTCUTS[normalized] || null;
}

/**
 * Get label for a route
 * @param {string} route - Route path
 * @returns {string} Human-readable label
 */
export function getRouteLabel(route) {
  return ROUTE_LABELS[route] || route;
}

