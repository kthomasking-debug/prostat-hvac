// src/data/stateRates.js
// State-based utility rates data
// Data source: Average residential rates by state

/**
 * State-based electricity rates ($/kWh)
 * Converted from ¢/kWh to $/kWh
 * Complete list of all US states
 */
export const STATE_ELECTRICITY_RATES = {
  Hawaii: 0.3825,
  California: 0.3011,
  Massachusetts: 0.2674,
  Alaska: 0.2491,
  Maine: 0.246,
  "Rhode Island": 0.245,
  Connecticut: 0.243,
  "New York": 0.2413,
  "District of Columbia": 0.2154,
  Vermont: 0.215,
  "New Hampshire": 0.2149,
  "New Jersey": 0.2144,
  Michigan: 0.1786,
  Maryland: 0.1708,
  Pennsylvania: 0.1663,
  Delaware: 0.1655,
  "West Virginia": 0.1555,
  Florida: 0.153,
  "North Carolina": 0.152,
  "South Carolina": 0.151,
  Arizona: 0.149,
  Wisconsin: 0.148,
  Texas: 0.146,
  Nevada: 0.145,
  Minnesota: 0.144,
  Tennessee: 0.143,
  Oregon: 0.142,
  Virginia: 0.141,
  Montana: 0.14,
  Georgia: 0.139,
  Indiana: 0.138,
  Ohio: 0.137,
  Missouri: 0.136,
  Alabama: 0.135,
  Illinois: 0.1334,
  Colorado: 0.133,
  Iowa: 0.132,
  Kansas: 0.131,
  Kentucky: 0.13,
  "New Mexico": 0.129,
  "South Dakota": 0.128,
  Wyoming: 0.127,
  Arkansas: 0.126,
  Mississippi: 0.125,
  Utah: 0.124,
  Nebraska: 0.123,
  Oklahoma: 0.122,
  Louisiana: 0.121,
  "North Dakota": 0.12,
  Idaho: 0.119,
  Washington: 0.118,
  // Default fallback for unlisted states
  DEFAULT: 0.15,
};

/**
 * State-based natural gas rates ($/therm)
 */
export const STATE_GAS_RATES = {
  Alabama: 2.264,
  Alaska: 7.0,
  Arizona: 1.757,
  Arkansas: 2.104,
  California: 4.372,
  Colorado: 1.4,
  Connecticut: 3.098,
  Delaware: 2.79,
  "District of Columbia": 3.301,
  Florida: 2.577,
  Georgia: 2.934,
  Hawaii: 5.56,
  Idaho: 1.235,
  Illinois: 1.892,
  Indiana: 2.133,
  Iowa: 1.958,
  Kansas: 1.728,
  Kentucky: 2.383,
  Louisiana: 1.583,
  Maine: 3.717,
  Maryland: 2.876,
  Massachusetts: 2.725,
  Michigan: 2.075,
  Minnesota: 1.467,
  Mississippi: 2.017,
  Missouri: 2.23,
  Montana: 1.149,
  Nebraska: 1.807,
  Nevada: 1.313,
  "New Hampshire": 3.417,
  "New Jersey": 2.394,
  "New Mexico": 1.168,
  "New York": 2.597,
  "North Carolina": 2.471,
  "North Dakota": 1.332,
  Ohio: 1.969,
  Oklahoma: 1.516,
  Oregon: 1.67,
  Pennsylvania: 1.747,
  "Rhode Island": 3.012,
  "South Carolina": 2.645,
  "South Dakota": 1.911,
  Tennessee: 2.181,
  Texas: 1.371,
  Utah: 1.149,
  Vermont: 3.544,
  Virginia: 2.423,
  Washington: 1.622,
  "West Virginia": 1.68,
  Wisconsin: 1.554,
  Wyoming: 1.226,
  // Default fallback for unlisted states
  DEFAULT: 1.2,
};

/**
 * Get electricity rate by state name (case-insensitive)
 * @param {string} stateName - Full state name
 * @returns {number} Rate in $/kWh
 */
export function getStateElectricityRate(stateName) {
  if (!stateName) return STATE_ELECTRICITY_RATES.DEFAULT;

  const normalizedState = stateName.trim();

  // Direct match
  if (STATE_ELECTRICITY_RATES[normalizedState]) {
    return STATE_ELECTRICITY_RATES[normalizedState];
  }

  // Case-insensitive fallback
  const stateKey = Object.keys(STATE_ELECTRICITY_RATES).find(
    (key) => key.toLowerCase() === normalizedState.toLowerCase()
  );

  return stateKey 
    ? STATE_ELECTRICITY_RATES[stateKey] 
    : STATE_ELECTRICITY_RATES.DEFAULT;
}

/**
 * Get gas rate by state name (case-insensitive)
 * @param {string} stateName - Full state name
 * @returns {number} Rate in $/therm
 */
export function getStateGasRate(stateName) {
  if (!stateName) return STATE_GAS_RATES.DEFAULT;

  const normalizedState = stateName.trim();

  // Direct match
  if (STATE_GAS_RATES[normalizedState]) {
    return STATE_GAS_RATES[normalizedState];
  }

  // Case-insensitive fallback
  const stateKey = Object.keys(STATE_GAS_RATES).find(
    (key) => key.toLowerCase() === normalizedState.toLowerCase()
  );

  return stateKey 
    ? STATE_GAS_RATES[stateKey] 
    : STATE_GAS_RATES.DEFAULT;
}

/**
 * Check if a state has a specific electricity rate (not default)
 * @param {string} stateName - Full state name
 * @returns {boolean}
 */
export function hasStateElectricityRate(stateName) {
  if (!stateName) return false;
  const normalizedState = stateName.trim();
  
  if (STATE_ELECTRICITY_RATES[normalizedState]) return true;
  
  return Object.keys(STATE_ELECTRICITY_RATES).some(
    (key) => key.toLowerCase() === normalizedState.toLowerCase() && key !== 'DEFAULT'
  );
}

/**
 * Check if a state has a specific gas rate (not default)
 * @param {string} stateName - Full state name
 * @returns {boolean}
 */
export function hasStateGasRate(stateName) {
  if (!stateName) return false;
  const normalizedState = stateName.trim();
  
  if (STATE_GAS_RATES[normalizedState]) return true;
  
  return Object.keys(STATE_GAS_RATES).some(
    (key) => key.toLowerCase() === normalizedState.toLowerCase() && key !== 'DEFAULT'
  );
}


