// src/utils/askJouleContent.js
// Static content and personality responses for AskJoule

/**
 * Educational content database for HVAC terms and concepts
 */
export const EDUCATIONAL_CONTENT = {
  hspf: "HSPF (Heating Seasonal Performance Factor) measures heat pump heating efficiency. Higher is better. Modern systems: 8-11 HSPF2. Each point improvement saves ~10-12% on heating costs.",
  seer: "SEER (Seasonal Energy Efficiency Ratio) measures cooling efficiency. Modern minimum: 14-15 SEER2. Premium systems: 18-22 SEER2. Each point saves ~5-7% on cooling.",
  cop: "COP (Coefficient of Performance) is instantaneous efficiency: BTU output ÷ BTU input. Heat pumps typically have COP of 2.5-4.0, meaning 250-400% efficient.",
  hdd: "HDD (Heating Degree Days) measures heating demand. Sum of daily (65°F - avg temp) when below 65°F. Higher HDD = colder climate, more heating needed.",
  cdd: "CDD (Cooling Degree Days) measures cooling demand. Sum of daily (avg temp - 65°F) when above 65°F. Higher CDD = hotter climate, more AC needed.",
  insulation:
    "Insulation reduces heat transfer. R-value measures resistance. Attic: R-38 to R-60. Walls: R-13 to R-21. Better insulation = smaller system needed + lower bills.",
  thermalfactor:
    "Energy Factor (also called Thermal Factor or Building Factor) measures your home's heat loss rate in BTU per hour per degree Fahrenheit difference. It's calculated from your home's square footage, insulation, windows, and other factors. Lower is better - it means less heat loss. Upload thermostat data in Performance Analyzer to calculate your actual energy factor.",
  auxheat:
    "Aux/backup heat activates when outdoor temp drops below heat pump balance point (~25-35°F). Uses expensive resistance strips. Minimize by upgrading to cold-climate HP.",
  balancepoint:
    "Balance Point is the outdoor temperature where your heat pump's capacity exactly matches your home's heat loss. Below this, auxiliary heat kicks in. Lower is better - cold-climate heat pumps can have balance points below 0°F.",
  tonnage:
    "Tonnage measures cooling capacity. 1 ton = 12,000 BTU/hr. A 3-ton system removes 36,000 BTU/hr. Proper sizing is critical - oversized systems short-cycle and waste energy.",
  eer: "EER (Energy Efficiency Ratio) measures cooling efficiency at a specific condition (95°F outdoor). Unlike SEER which averages the season, EER shows peak performance.",
  defrost:
    "Heat pumps need defrost cycles when outdoor coils ice up (typically 25-40°F with high humidity). During defrost, the system briefly runs in cooling mode to melt ice.",
};

/**
 * Personality-driven response generator
 * Creates friendly, context-aware responses with time-of-day awareness
 *
 * @param {string} action - The type of action performed
 * @param {object} data - Context data (temp, delta, etc.)
 * @returns {string} A personalized response message
 */
export function getPersonalizedResponse(action, data = {}) {
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;
  const isMorning = hour >= 6 && hour < 12;
  const isEvening = hour >= 18 && hour < 22;

  const responses = {
    tempUp: [
      `You got it! Setting temperature to ${data.temp}°F.`,
      `Done! Warming things up to ${data.temp}°F.`,
      `${data.temp}°F coming right up!`,
      isNight
        ? `Cozy! Setting to ${data.temp}°F for the night.`
        : isMorning
        ? `Good morning! Setting to ${data.temp}°F to start your day.`
        : `Sure thing! ${data.temp}°F it is.`,
    ],
    tempDown: [
      `Cool! Setting temperature to ${data.temp}°F.`,
      `Energy saver mode activated. ${data.temp}°F.`,
      `${data.temp}°F - that'll save you some money!`,
      data.temp < 62
        ? `Brrr, that's chilly! ${data.temp}°F set.`
        : `Got it, ${data.temp}°F.`,
    ],
    sleep: [
      `Good night! Setting sleep temperature to ${data.temp}°F. Sweet dreams!`,
      `Sleep mode activated. ${data.temp}°F will save energy while you rest.`,
      `Perfect for sleeping! ${data.temp}°F set. Rest well!`,
      isEvening
        ? `Getting ready for bed? ${data.temp}°F is perfect for sleep.`
        : `Sleep mode engaged at ${data.temp}°F.`,
    ],
    away: [
      `Away mode set to ${data.temp}°F. Have a great trip!`,
      `Eco mode engaged at ${data.temp}°F. I'll watch the house!`,
      `Got it! ${data.temp}°F while you're away. See you soon!`,
      `Saving energy at ${data.temp}°F until you return!`,
    ],
    home: [
      isMorning
        ? `Welcome back! Setting to comfortable ${data.temp}°F.`
        : `Home sweet home! ${data.temp}°F.`,
      `Home mode activated at ${data.temp}°F. Good to have you back!`,
      `${data.temp}°F - the perfect homecoming temperature!`,
      isEvening
        ? `Welcome home! Warming up to ${data.temp}°F for the evening.`
        : `Setting to ${data.temp}°F. Make yourself comfortable!`,
    ],
    queryTemp: [
      `Current temperature setting is ${data.temp}°F.`,
      `You're at ${data.temp}°F right now.`,
      `${data.temp}°F is your current target.`,
      `Your thermostat is set to ${data.temp}°F.`,
    ],
    highTemp: [
      `Whoa, ${data.temp}°F is pretty toasty! Your energy bill might not like this, but you'll be warm!`,
      `That's hot! ${data.temp}°F set, but keep an eye on your bill.`,
      `${data.temp}°F? That's a warm one! Comfort over cost, I get it.`,
    ],
    lowTemp: [
      `Bundle up! ${data.temp}°F is quite cool, but you'll save on energy.`,
      `Eco warrior! ${data.temp}°F will definitely cut costs.`,
      `${data.temp}°F - that's some serious energy saving! Stay warm!`,
    ],
    settingUpdated: [
      `✓ Got it! ${data.setting} is now ${data.value}${data.unit || ""}.`,
      `✓ ${data.setting} updated to ${data.value}${data.unit || ""}.`,
      `✓ Done! ${data.setting}: ${data.value}${data.unit || ""}.`,
    ],
    error: [
      `Hmm, that didn't work. ${data.message || "Try again?"}`,
      `Oops! ${data.message || "Something went wrong."}`,
      `Sorry about that - ${data.message || "let me try again."}`,
    ],
    greeting: [
      isMorning
        ? "Good morning! How can I help with your home comfort today?"
        : isEvening
        ? "Good evening! What can I do for you?"
        : isNight
        ? "Burning the midnight oil? How can I help?"
        : "Hey there! What would you like to know?",
    ],
    success: [
      `Done! ${data.message || "All set."}`,
      `✓ ${data.message || "Success!"}`,
      `Perfect! ${data.message || "That's taken care of."}`,
    ],
  };

  const options = responses[action] || [`${action} complete.`];
  const base = options[Math.floor(Math.random() * options.length)];

  // Add warnings for extreme temps
  if (data.temp && data.temp > 78) {
    return responses.highTemp[
      Math.floor(Math.random() * responses.highTemp.length)
    ];
  }
  if (data.temp && data.temp < 60) {
    return responses.lowTemp[
      Math.floor(Math.random() * responses.lowTemp.length)
    ];
  }

  return base;
}

/**
 * Get a contextual suggestion based on current system state
 *
 * @param {object} context - Current system context
 * @returns {string[]} Array of suggested questions
 */
export function getContextualSuggestions(context = {}) {
  const { recommendations, userSettings, userLocation } = context;
  const suggestions = [];

  // Personalized based on recommendations
  if (recommendations && recommendations.length > 0) {
    suggestions.push("What can I save?");
    const topRec = recommendations[0];
    if (topRec.savingsEstimate > 200) {
      suggestions.push(
        `How to save $${Math.round(topRec.savingsEstimate)}/year`
      );
    }
  }

  // System-specific suggestions
  if (userSettings) {
    if (userSettings.hspf2 && userSettings.hspf2 < 9) {
      suggestions.push("What if I had a 10 HSPF system?");
    }
    if (userSettings.efficiency && userSettings.efficiency < 16) {
      suggestions.push("What if I had 18 SEER?");
    }
  }

  // Location-specific suggestions
  if (userLocation && userLocation.city) {
    suggestions.push(`What's normal for ${userLocation.city}?`);
    suggestions.push(`Show me ${userLocation.city} forecast`);
  }

  // General helpful queries
  const generalSuggestions = [
    "My Joule Score",
    "How's my system?",
    "Explain HSPF",
    "Why is my bill high?",
    "Run analyzer",
    "Calculate balance point",
    "What's my energy factor?",
  ];

  suggestions.push(...generalSuggestions);

  return suggestions.slice(0, 8); // Limit to 8
}

/**
 * Help text content for the "help" command
 */
export const HELP_CONTENT = `🔍 **Ask Joule Capabilities**

**Questions I can answer:**
• "What can I save?" - Show recommendations
• "How's my system?" - System summary
• "Why is my bill high?" - Analyze factors
• "What is HSPF/SEER?" - Learn terms
• "Calculate balance point" - Find your balance point

**Navigate to tools:**
• "forecast" - 7-Day Cost Forecaster
• "compare" - Heat pump vs gas
• "balance" - Energy flow viz
• "charging" - A/C calculator
• "analyzer" - Performance tool
• "methodology" - Math formulas
• "settings" - Preferences
• "thermostat" - Setback analysis
• "budget" - Monthly planner
• "upgrade" - ROI calculator

**Change settings:**
• "Set winter to 68"
• "Set HSPF to 10"
• "Set cost to $0.12"
• "Set 2000 sq ft"

Try: "show forecast" or "compare"!`;

