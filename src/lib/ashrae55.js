/**
 * ASHRAE Standard 55 Thermal Comfort Calculator
 * Based on ASHRAE Standard 55-2020: Thermal Environmental Conditions for Human Occupancy
 *
 * This implements simplified ASHRAE 55 calculations for thermal comfort recommendations.
 * For full implementation, see pythermalcomfort library (Python).
 */

/**
 * Calculate recommended temperature range based on ASHRAE Standard 55
 * @param {Object} params - Parameters for thermal comfort calculation
 * @param {number} params.relativeHumidity - Relative humidity (0-100%)
 * @param {string} params.season - 'winter' or 'summer'
 * @param {number} params.metabolicRate - Metabolic rate in met (default: 1.0 for sedentary)
 * @param {number} params.clothingInsulation - Clothing insulation in clo (default: 0.5 for summer, 1.0 for winter)
 * @returns {Object} Recommended temperature range and optimal setpoint
 */
export function calculateASHRAE55Comfort({
  relativeHumidity = 50,
  season = "winter",
  metabolicRate = 1.0,
  clothingInsulation = null,
}) {
  // Default clothing insulation based on season if not provided
  if (clothingInsulation === null) {
    clothingInsulation = season === "winter" ? 1.0 : 0.5;
  }

  // ASHRAE Standard 55 acceptable temperature ranges (simplified)
  // Based on 50% relative humidity, sedentary activity (1.0 met), typical clothing
  // These are simplified ranges - full ASHRAE 55 uses PMV/PPD model

  let tempRange;
  let optimalTemp;

  if (season === "winter" || season === "heating") {
    // Winter heating season
    if (relativeHumidity <= 30) {
      tempRange = { min: 68.5, max: 76.0 };
      optimalTemp = 70.0; // Middle of range
    } else if (relativeHumidity <= 50) {
      tempRange = { min: 68.5, max: 74.5 };
      optimalTemp = 70.0; // Middle of range
    } else {
      // Higher humidity - slightly lower max
      tempRange = { min: 68.5, max: 73.5 };
      optimalTemp = 70.0;
    }
  } else {
    // Summer cooling season
    if (relativeHumidity <= 30) {
      tempRange = { min: 74.0, max: 80.0 };
      optimalTemp = 76.0; // Middle of range
    } else if (relativeHumidity <= 50) {
      tempRange = { min: 73.0, max: 79.0 };
      optimalTemp = 76.0; // Middle of range
    } else {
      // Higher humidity - slightly lower max
      tempRange = { min: 73.0, max: 78.0 };
      optimalTemp = 75.5;
    }
  }

  // Adjust for clothing insulation
  // More clothing (higher clo) = can tolerate lower temps in winter, higher in summer
  if (season === "winter" || season === "heating") {
    if (clothingInsulation > 1.0) {
      optimalTemp -= 1.0; // Can be cooler with more clothing
      tempRange.min -= 1.0;
    }
  } else {
    if (clothingInsulation < 0.5) {
      optimalTemp += 1.0; // Can be warmer with less clothing
      tempRange.max += 1.0;
    }
  }

  // Adjust for metabolic rate (activity level)
  // Higher activity = can tolerate cooler temps
  if (metabolicRate > 1.2) {
    optimalTemp -= 1.0;
    tempRange.min -= 1.0;
    tempRange.max -= 0.5;
  }

  return {
    optimalTemp: Math.round(optimalTemp * 10) / 10,
    tempRange,
    season,
    relativeHumidity,
    explanation: `ASHRAE Standard 55 recommends ${optimalTemp.toFixed(
      1
    )}°F for ${season} conditions at ${relativeHumidity}% relative humidity, assuming sedentary activity (1.0 met) and typical clothing.`,
  };
}

/**
 * Get ASHRAE 55 recommendations for sleep/unoccupied periods
 * @param {string} season - 'winter' or 'summer'
 * @returns {number} Recommended temperature for sleep
 */
export function getASHRAE55SleepTemp(season = "winter") {
  // ASHRAE 55 allows wider range for unoccupied/sleep periods
  // Typically 2-4°F lower in winter, 2-4°F higher in summer
  if (season === "winter" || season === "heating") {
    return 68.0; // 2°F below optimal 70°F
  } else {
    return 78.0; // 2°F above optimal 76°F
  }
}

/**
 * Format ASHRAE 55 recommendation for display
 */
export function formatASHRAE55Recommendation(result) {
  return {
    message: result.explanation,
    optimalTemp: result.optimalTemp,
    range: `${result.tempRange.min}°F - ${result.tempRange.max}°F`,
    season: result.season,
  };
}
