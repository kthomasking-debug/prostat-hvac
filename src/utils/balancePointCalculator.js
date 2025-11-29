// Balance point calculation utility for Ask Joule
// Calculates the outdoor temperature where heat pump output equals building heat loss

const CONSTANTS = {
  BTU_PER_KWH: 3412,
  KW_PER_TON_OUTPUT: 3.5,
  MIN_CAPACITY_FACTOR: 0.65,
};

export function calculateBalancePoint(userSettings = {}) {
  // Ensure we always have valid defaults - handle null/undefined explicitly
  let tons = userSettings.tons;
  if (!tons && userSettings.capacity) {
    // Convert capacity (kBTU) to tons: 12 kBTU = 1 ton
    tons = userSettings.capacity / 12.0;
  }
  if (!tons || tons <= 0) {
    tons = 3; // Default to 3 tons if not set
  }
  
  const {
    squareFeet = 2000,
    ceilingHeight = 8,
    insulationLevel = 1.0, // multiplier: 0.65 = good, 1.0 = average, 1.4 = poor
    hspf2 = 9,
    targetIndoorTemp = userSettings.winterThermostat || 68,
    designOutdoorTemp = 20,
  } = userSettings;

  // Calculate building heat loss rate (BTU/hr per °F difference)
  const volume = squareFeet * ceilingHeight;
  const baseHeatLossPerDegF = volume * 0.018; // Base factor for heat loss
  const btuLossPerDegF = baseHeatLossPerDegF * insulationLevel;

  // Heat pump capacity derating with temperature
  // At 47°F, HP operates at rated capacity. Below that, capacity decreases
  const ratedCapacityBtu = tons * 12000; // Tons to BTU/hr at rated conditions

  // Generate temperature range data from 60°F down to design temp
  const data = [];
  for (let temp = 60; temp >= designOutdoorTemp; temp -= 1) {
    // Capacity derating: linear approximation
    // At 47°F = 100%, at 17°F ≈ 65%, at 5°F ≈ 50%
    const capacityFactor = Math.max(
      CONSTANTS.MIN_CAPACITY_FACTOR,
      1.0 - (47 - temp) * 0.012 // ~1.2% loss per degree below 47°F
    );
    const thermalOutputBtu = ratedCapacityBtu * capacityFactor;

    // Building heat loss at this outdoor temp
    const deltaT = targetIndoorTemp - temp;
    const buildingHeatLossBtu = btuLossPerDegF * deltaT;

    // COP calculation based on HSPF2
    const avgCOP = hspf2 / 3.4;
    const tempAdjustedCOP = avgCOP * (1 + (temp - 47) * 0.01);
    const cop = Math.max(1.5, tempAdjustedCOP);

    data.push({
      outdoorTemp: temp,
      thermalOutputBtu,
      buildingHeatLossBtu,
      cop,
      surplus: thermalOutputBtu - buildingHeatLossBtu,
    });
  }

  // Find balance point: where surplus goes from positive to negative
  let balancePoint = null;
  for (let i = 0; i < data.length - 1; i++) {
    const curr = data[i];
    const next = data[i + 1];
    if (curr.surplus >= 0 && next.surplus < 0) {
      // Linear interpolation
      const t = curr.surplus / (curr.surplus - next.surplus);
      balancePoint =
        curr.outdoorTemp + t * (next.outdoorTemp - curr.outdoorTemp);
      break;
    }
  }
  
  // If no crossover found, check if system is oversized (always positive surplus)
  // or undersized (always negative surplus)
  if (balancePoint === null && data.length > 0) {
    const firstSurplus = data[0].surplus;
    const lastSurplus = data[data.length - 1].surplus;
    
    // If surplus is always positive, system is oversized - balance point is below design temp
    if (firstSurplus > 0 && lastSurplus > 0) {
      // Extrapolate below design temp to find where it would cross zero
      // Use the trend from the last two points
      if (data.length >= 2) {
        const last = data[data.length - 1];
        const secondLast = data[data.length - 2];
        const surplusSlope = (last.surplus - secondLast.surplus) / (last.outdoorTemp - secondLast.outdoorTemp);
        if (surplusSlope < 0 && Math.abs(surplusSlope) > 0.001) { // Negative slope means surplus is decreasing
          balancePoint = last.outdoorTemp - (last.surplus / surplusSlope);
        } else {
          // If slope is too small, estimate based on average rate of change
          const avgSurplusChange = (firstSurplus - lastSurplus) / (data[0].outdoorTemp - last.outdoorTemp);
          if (avgSurplusChange < 0 && Math.abs(avgSurplusChange) > 0.001) {
            balancePoint = last.outdoorTemp - (last.surplus / avgSurplusChange);
          } else {
            // Very oversized system - balance point is well below design temp
            balancePoint = designOutdoorTemp - 10; // Estimate 10°F below design
          }
        }
      } else {
        // Only one data point - estimate based on heat loss vs capacity
        balancePoint = designOutdoorTemp - 10; // Conservative estimate
      }
    }
    // If surplus is always negative, system is undersized - balance point is above 60°F
    else if (firstSurplus < 0 && lastSurplus < 0) {
      // Extrapolate above 60°F to find where it would cross zero
      if (data.length >= 2) {
        const first = data[0];
        const second = data[1];
        const surplusSlope = (second.surplus - first.surplus) / (second.outdoorTemp - first.outdoorTemp);
        if (surplusSlope > 0 && Math.abs(surplusSlope) > 0.001) { // Positive slope means surplus is increasing
          balancePoint = first.outdoorTemp - (first.surplus / surplusSlope);
        } else {
          // If slope is too small, estimate based on average rate of change
          const avgSurplusChange = (lastSurplus - firstSurplus) / (last.outdoorTemp - first.outdoorTemp);
          if (avgSurplusChange > 0 && Math.abs(avgSurplusChange) > 0.001) {
            balancePoint = first.outdoorTemp - (first.surplus / avgSurplusChange);
          } else {
            // Very undersized system - balance point is well above 60°F
            balancePoint = 70; // Estimate 70°F (above normal range)
          }
        }
      } else {
        // Only one data point - estimate based on heat loss vs capacity
        balancePoint = 70; // Conservative estimate for undersized
      }
    }
    // If surplus changes sign but we didn't catch it in the loop, find the closest crossover
    else if (firstSurplus * lastSurplus < 0) {
      // There IS a crossover, but we missed it - find it more carefully
      for (let i = 0; i < data.length - 1; i++) {
        const curr = data[i];
        const next = data[i + 1];
        if (Math.abs(curr.surplus) < 100 || Math.abs(next.surplus) < 100) {
          // Very close to zero - use interpolation
          const t = curr.surplus / (curr.surplus - next.surplus);
          balancePoint = curr.outdoorTemp + t * (next.outdoorTemp - curr.outdoorTemp);
          break;
        }
      }
    }
    
    // Final fallback: if still null, estimate based on system capacity vs heat loss
    if (balancePoint === null && data.length > 0) {
      // Estimate balance point as the temperature where capacity roughly equals heat loss
      // This is a simplified calculation
      const avgCapacity = data.reduce((sum, d) => sum + d.thermalOutputBtu, 0) / data.length;
      const avgHeatLossRate = btuLossPerDegF;
      // At balance point: capacity = heatLossRate * (targetIndoorTemp - balancePoint)
      // So: balancePoint = targetIndoorTemp - (capacity / heatLossRate)
      balancePoint = targetIndoorTemp - (avgCapacity / avgHeatLossRate);
      // Clamp to reasonable range
      balancePoint = Math.max(0, Math.min(80, balancePoint));
    }
  }

  // Calculate aux heat need at design temp
  const designData = data.find((d) => d.outdoorTemp === designOutdoorTemp);
  const auxHeatNeeded = designData ? Math.max(0, -designData.surplus) : 0;

  return {
    balancePoint: balancePoint ? Math.round(balancePoint * 10) / 10 : null,
    auxHeatAtDesign: Math.round(auxHeatNeeded),
    copAtDesign: designData ? Math.round(designData.cop * 100) / 100 : null,
    heatLossFactor: Math.round(btuLossPerDegF),
    interpretation: getBalancePointInterpretation(balancePoint),
  };
}

function getBalancePointInterpretation(balancePoint) {
  if (!balancePoint) return "Unable to calculate - check your system settings";

  if (balancePoint <= 25) {
    return "Lower balance point — heat pump is well-sized for your home. Minimal aux heat needed.";
  } else if (balancePoint <= 35) {
    return "Moderate balance point — aux heat will help on colder days. System is reasonably sized.";
  } else {
    return "Higher balance point — aux heat will engage more often in winter. Consider upgrading to larger/more efficient unit.";
  }
}

export function formatBalancePointResponse(result, userSettings) {
  if (!result.balancePoint) {
    return "I need your system details to calculate the balance point. Please set your square footage, HSPF rating, and system capacity in Settings first.";
  }

  const { balancePoint, auxHeatAtDesign, copAtDesign, heatLossFactor } = result;
  const { designOutdoorTemp = 20 } = userSettings;

  return `Your system's balance point is **${balancePoint}°F** — the outdoor temperature where your heat pump's output equals your home's heat loss.

**Key metrics:**
• Balance point: ${balancePoint}°F
• Heat loss rate: ${heatLossFactor.toLocaleString()} BTU/hr per °F
• COP at ${designOutdoorTemp}°F design: ${copAtDesign}
• Aux heat needed at ${designOutdoorTemp}°F: ${auxHeatAtDesign.toLocaleString()} BTU/hr

**What this means:**
${result.interpretation}

Below ${balancePoint}°F, your heat pump alone can't keep up, and auxiliary heat (electric strips or gas furnace backup) will engage to maintain comfort.`;
}
