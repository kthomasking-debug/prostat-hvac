/**
 * HVAC Engineering Knowledge Base
 * Structured knowledge from ACCA Manual J/S/D, ASHRAE 55/62.2, DOE guides, and industry standards
 * Used for RAG (Retrieval-Augmented Generation) in Ask Joule
 */

export const HVAC_KNOWLEDGE_BASE = {
  // ACCA Manual J - Load Calculation
  manualJ: {
    title: "ACCA Manual J - Residential Load Calculation",
    source: "ACCA Manual J, 8th Edition",
    topics: {
      heatLoss: {
        summary:
          "Manual J provides the industry standard for calculating residential heating and cooling loads.",
        keyConcepts: [
          "Heat loss calculation: Q = U × A × ΔT, where U is U-value, A is area, ΔT is temperature difference",
          "Design conditions: 99% heating design temp and 1% cooling design temp from TMY3 data",
          "Heat loss components: conduction through walls/roof/floor, infiltration, ventilation",
          "U-values vary by construction: R-13 wall = U-0.077, R-30 roof = U-0.033",
          "Infiltration: 0.35 ACH (air changes per hour) typical for tight homes, 0.5-0.7 for average",
          "Infiltration definition: Uncontrolled leakage of air through cracks, gaps, and openings in building envelope",
          "Infiltration importance: Often the single largest load component in older homes, can be 30-40% of total heating load",
          "Blower Door Test: Manual J requires ACH50 score (air changes per hour at 50 Pascal pressure difference) for accurate calculation",
          "ACH50 measurement: Standard test measures home tightness - lower ACH50 = tighter home",
          "Tight home: ACH50 < 3 (0.15-0.25 ACH normal conditions)",
          "Average home: ACH50 3-7 (0.35-0.5 ACH normal conditions)",
          "Loose home: ACH50 > 7 (0.5-1.0+ ACH normal conditions)",
          "Qualitative assessment: If Blower Door not available, use Tight/Average/Loose classification",
          "Infiltration penalty: Older homes without air sealing can have 50-100% higher heating loads due to infiltration",
          "Ventilation: ASHRAE 62.2 requires 7.5 CFM per person + 0.03 CFM per sq ft",
        ],
        formulas: {
          totalHeatLoss:
            "Q_total = Q_conduction + Q_infiltration + Q_ventilation",
          conduction: "Q_cond = Σ(U_i × A_i × ΔT_design)",
          infiltration: "Q_inf = 1.08 × CFM × ΔT × ACH × Volume / 60",
        },
      },
      coolingLoad: {
        summary: "Cooling load includes sensible and latent components.",
        keyConcepts: [
          "Sensible load: temperature reduction (BTU/hr)",
          "Latent load: humidity removal (BTU/hr)",
          "Solar gain: varies by window orientation, shading, glazing type",
          "Internal gains: people (230 BTU/hr sensible, 200 BTU/hr latent per person when sitting), appliances, lighting",
          "Occupant load: Manual J assigns approximately 230 BTU sensible and 200 BTU latent per person (sitting/office activity)",
          "Party example: 10 people adds nearly half a ton (4,300 BTU) of cooling load",
          "Metabolic rate: Sitting = 1.0 met, Light activity = 1.2 met, affects sensible heat gain",
          "Design conditions: 1% cooling design temp (typically 90-95°F outdoor, 75°F indoor)",
          "Latent ratio: typically 0.2-0.3 for residential (20-30% of total load is latent)",
        ],
      },
      solarHeatGain: {
        summary:
          "Solar heat gain through windows (fenestration) is a major component of cooling load.",
        keyConcepts: [
          "Fenestration loads: Windows are the largest source of solar heat gain in homes",
          "Direction matters: East/West exposure has higher peak solar gain than South-facing windows",
          "South windows: Lower peak gain but more consistent throughout the day",
          "East/West windows: Higher peak gain in morning (East) and afternoon (West) - typically 2-3x South",
          "Solar Heat Gain Coefficient (SHGC): Measures how much solar radiation passes through glass (0.2-0.8 typical)",
          "Shading: Overhangs, trees, and window treatments significantly reduce solar gain",
          "Glazing type: Double-pane low-E windows reduce SHGC by 30-50% vs single-pane",
          "Manual J tables: Provides SHGC multipliers by orientation, glazing type, and shading",
        ],
        formulas: {
          solarGain:
            "Q_solar = SHGC × Area × Solar_Intensity × Orientation_Multiplier",
        },
      },
      roofColor: {
        summary:
          "Roof color and surface properties affect cooling load through solar absorption.",
        keyConcepts: [
          "Dark roofs: Absorb more solar radiation, increasing Sol-Air temperature significantly",
          "Light roofs: Reflect more solar radiation, reducing cooling load by 20-40%",
          "Sol-Air temperature: Effective temperature accounting for solar radiation absorption",
          "Dark roof example: Can reach 150-180°F surface temp in summer (vs 100-120°F for light)",
          "Radiant barrier: Reflective layer under roof reduces heat transfer to attic by 30-50%",
          "Cool roof rating: Reflectance >0.65 and emittance >0.90 qualifies as 'cool roof'",
          "Impact on load: Dark roof can add 10-20% to cooling load vs light roof with radiant barrier",
          "Manual J: Includes roof color multipliers in load calculations",
        ],
      },
      sizing: {
        summary: "Manual J determines the required equipment capacity.",
        keyConcepts: [
          "Total load = heating load + cooling load (use larger of the two for sizing)",
          "Safety factors: Manual J does NOT add safety factors - use calculated load directly",
          "Oversizing penalty: 10-15% efficiency loss per 10% oversizing",
          "Undersizing: system runs continuously, poor dehumidification, comfort issues",
          "Zoning: each zone calculated separately, then summed for central system",
        ],
      },
    },
  },

  // ACCA Manual S - Equipment Selection
  manualS: {
    title: "ACCA Manual S - Residential Equipment Selection",
    source: "ACCA Manual S",
    topics: {
      equipmentSelection: {
        summary:
          "Manual S guides selection of properly sized HVAC equipment based on Manual J loads.",
        keyConcepts: [
          "Select equipment within 15-20% of calculated load (100-115% of load, maximum 120%)",
          "CRITICAL RULE: Equipment should NOT be oversized by more than 15-20% above calculated load",
          "If load calc = 2.8 tons, maximum equipment = 3.36 tons (20% oversizing limit)",
          "Oversizing penalties: >20% causes poor humidity control, short cycling, efficiency loss",
          "Example: 2.8 ton load → 3.5 ton unit = 25% oversizing = TOO MUCH (violates Manual S)",
          "Heat pumps: select based on heating load at design temp, verify cooling capacity",
          "Gas furnaces: select based on heating load, verify AFUE rating",
          "Oversizing check: if equipment > 115-120% of load, it's oversized (inefficient, poor dehumidification)",
          "Undersizing check: if equipment < 100% of load, it's undersized (won't maintain temp)",
          "Multi-stage equipment: first stage should handle 60-70% of load for efficiency",
        ],
      },
      altitudeDerating: {
        summary:
          "Equipment capacity decreases at high altitude due to reduced air density.",
        keyConcepts: [
          "Air density: Decreases with altitude - less air = less heat transfer capacity",
          "Capacity loss: Approximately 2-4% per 1000 feet of elevation above sea level",
          "Example: At 5000ft elevation, capacity reduced by 10-20% vs sea level",
          "Manual S requirement: Must derate equipment specifications for altitude",
          "Heat pumps: Both heating and cooling capacity affected by altitude",
          "Gas furnaces: Also affected - combustion efficiency decreases at altitude",
          "Solution: Select larger equipment or use altitude-corrected capacity tables",
          "Critical: Failure to derate can result in undersized system at high altitude",
        ],
        formulas: {
          altitudeDerating:
            "Capacity_altitude = Capacity_sea_level × (1 - 0.02 to 0.04 × Elevation_1000ft)",
        },
      },
      heatPumpSizing: {
        summary: "Heat pump sizing requires balance point analysis.",
        keyConcepts: [
          "Balance point: outdoor temp where heat pump capacity = heat loss",
          "Below balance point: aux heat required (electric strip or gas backup)",
          "Design temp sizing: heat pump sized for 47°F (AHRI rating temp), not design temp",
          "Aux heat sizing: sized for design temp minus heat pump capacity at design temp",
          "Example: 36k BTU load at 20°F, 36k BTU heat pump at 47°F → aux needed below ~30°F",
        ],
      },
      capacityDerating: {
        summary:
          "Heat pump capacity decreases significantly at low outdoor temperatures.",
        keyConcepts: [
          "AHRI rating: Heat pump capacity at 47°F is the nominal high-temp capacity (marketing rating)",
          "Critical: You CANNOT rely on 47°F capacity rating for 10°F or 17°F design days",
          "Capacity drop: Heat pump capacity drops 20-40% from 47°F to 17°F depending on model",
          "Cold-climate units: Better derating curves (may only drop 10-20% from 47°F to 17°F)",
          "Standard units: Poor derating - capacity may drop 30-50% at 17°F vs 47°F",
          "Manual S requirement: Must verify capacity at design temperature (typically 17°F or lower), not just 47°F",
          "NEEP data: North East Energy Efficiency Partnerships provides capacity data at multiple temperatures",
          "COP degradation: COP also decreases at low temps (typically 3.0 at 47°F, 2.0 at 17°F)",
          "Example: Unit rated 36k BTU at 47°F may only deliver 24k BTU at 17°F (33% derating)",
          "Solution: Select heat pump based on capacity at design temp, not just nominal rating",
        ],
        warnings: {
          derating:
            "CRITICAL: Always check capacity at design temperature (17°F or lower) - 47°F rating is misleading for cold climates",
        },
      },
      sensibleHeatRatio: {
        summary:
          "Sensible Heat Ratio (SHR) measures temperature cooling vs humidity removal capacity.",
        keyConcepts: [
          "SHR definition: Ratio of sensible (temperature) cooling to total (sensible + latent) cooling capacity",
          "Sensible cooling: Lowers air temperature (measured in BTU/hr)",
          "Latent cooling: Removes moisture/humidity from air (measured in BTU/hr)",
          "SHR formula: SHR = Sensible Capacity / (Sensible Capacity + Latent Capacity)",
          "Ideal SHR: 0.70-0.75 for most homes (70-75% sensible, 25-30% latent)",
          "High SHR problem: If SHR is too high (0.85+), unit cools temperature but doesn't remove humidity",
          "Oversizing effect: Oversized equipment (Manual S violation) runs short cycles, satisfies temperature (sensible) before removing humidity (latent), causing high SHR",
          "Sticky feel at 72°F: If 72°F feels sticky, unit likely has high SHR - satisfying sensible load but not latent load",
          "Short cycling cause: Oversized unit reaches setpoint in 5 minutes, shuts off before dehumidifying properly",
          "Manual S requirement: Equipment must be properly sized to allow full dehumidification cycle",
          "Low SHR needed: For humid climates, need SHR < 0.75 to properly control humidity",
          "Multi-stage benefit: First stage runs longer, allowing proper dehumidification (lower effective SHR)",
        ],
      },
    },
  },

  // ACCA Manual D - Duct Design
  manualD: {
    title: "ACCA Manual D - Residential Duct Design",
    source: "ACCA Manual D",
    topics: {
      ductSizing: {
        summary:
          "Manual D provides duct sizing methodology for proper airflow distribution.",
        keyConcepts: [
          "CFM per ton: 400 CFM per ton for cooling (typical), 350-450 CFM range",
          'Static pressure: 0.5" WC typical for residential, 0.3-0.6" acceptable',
          'Friction rate: 0.1" per 100 ft typical, use friction chart for sizing',
          "Duct sizing: based on CFM, friction rate, and equivalent length",
          "Undersized ducts: high static pressure, poor airflow, noise, efficiency loss",
          "Oversized ducts: low velocity, poor mixing, comfort issues",
        ],
      },
      airflow: {
        summary: "Proper airflow is critical for system performance.",
        keyConcepts: [
          "Supply air temp: 55-60°F for cooling, 100-120°F for heating",
          "Return air: typically 75°F for cooling, 68°F for heating",
          "Delta T: 18-22°F typical for cooling, 30-50°F for heating",
          "Low airflow symptoms: poor cooling, high head pressure, short cycling",
          "High airflow symptoms: poor dehumidification, drafty, noise",
        ],
      },
      faceVelocity: {
        summary:
          "Return grille face velocity limits per Manual D to prevent noise.",
        keyConcepts: [
          "Return grille velocity limit: Manual D recommends keeping return grille face velocity below 400-500 FPM (Feet Per Minute) to prevent noise",
          "Face velocity: Calculated as CFM divided by free area of grille (not total grille area)",
          "Free area: Typical return grilles have 60-75% free area (rest is solid material)",
          "Whistling noise: If return grille is whistling, face velocity is likely exceeding 500 FPM",
          "Problem cause: Return grille is too small for the CFM your system is moving",
          "Solution: Replace with larger return grille, add additional return grilles, or reduce CFM",
          "Manual D standard: 300-400 FPM is ideal for return grilles, 400-500 FPM maximum",
          "Supply grille velocity: Can be higher (600-800 FPM) since noise is less of a concern at supply",
          "Noise vs airflow: Higher velocity = more noise, but too large = poor air distribution",
        ],
      },
      equivalentLength: {
        summary:
          "Equivalent length converts duct fittings into straight pipe length for friction calculations.",
        keyConcepts: [
          "Equivalent length definition: Method to convert fittings (elbows, tees, transitions) into equivalent straight pipe length for friction loss calculations",
          "Why it matters: Fittings add significant friction - must be accounted for in duct design",
          "Hard 90° elbow: Typically has equivalent length of 30-60 feet of straight duct (varies by diameter)",
          "Soft 90° elbow: Lower equivalent length than hard elbow, typically 10-20 feet",
          "Tee fitting: Can have equivalent length of 20-50 feet depending on flow direction",
          "Manual D tables: Provides equivalent length values for various fittings and duct diameters",
          "Flex duct kinks: Kinked flex duct can have equivalent length of 100+ feet - this is why kinks kill airflow",
          "Friction calculation: Total friction = (Straight length + Equivalent length) × Friction rate per 100 ft",
          "Design impact: Poorly designed duct systems with many fittings can double or triple effective duct length",
          "Best practice: Minimize fittings, use smooth transitions, keep flex duct pulled tight without kinks",
        ],
      },
      staticPressure: {
        summary:
          "Static pressure is critical for proper airflow and system longevity.",
        keyConcepts: [
          'Design static pressure: 0.5" WC typical for residential systems',
          'Acceptable range: 0.3-0.6" WC - above 0.6" is problematic',
          'High MERV filters: Increase static pressure significantly (MERV 13+ can add 0.2-0.3" WC)',
          'HEPA filters: Can increase static pressure by 0.3-0.5" WC vs standard filters',
          'Problem: If ducts designed for 0.5" WC and filter adds 0.3" WC, total = 0.8" WC (exceeds limit)',
          "Blower response: High static pressure forces blower to speed up, causing noise and reducing lifespan",
          "Solution: Upgrade to larger filter area, use lower MERV, or redesign ductwork for higher static",
          "Manual D: Duct system must account for filter pressure drop in design",
        ],
        warnings: {
          highPressure:
            'Static pressure >0.6" WC causes blower motor stress, noise, and premature failure',
          filterUpgrade:
            "Upgrading to HEPA/MERV 13+ requires verifying duct system can handle increased static",
        },
      },
      flexDuct: {
        summary: "Flexible ductwork has specific limitations per Manual D.",
        keyConcepts: [
          "Flex duct friction: Much higher friction than rigid duct (2-3x higher)",
          "Maximum length: Manual D recommends keeping flex duct runs short and pulled tight",
          "Sagging: Flex duct must be pulled tight - sagging increases friction and reduces airflow",
          "Excessive length: Long flex duct runs kill airflow due to high friction losses",
          "Best practice: Use rigid duct for long runs, flex only for short connections",
          "Installation: Must be fully extended (no compression), properly supported, no kinks",
          "Manual D rule: Flex duct should not exceed 15-20% of total duct length in well-designed systems",
        ],
        warnings: {
          length:
            "Excessive flex duct length is a common cause of poor airflow and system performance",
          sagging:
            "Sagging flex duct can reduce airflow by 30-50% due to increased friction",
        },
      },
      ventClosing: {
        summary:
          "WARNING: Closing vents is dangerous and violates Manual D design principles.",
        keyConcepts: [
          "CRITICAL: DO NOT close vents in unused rooms - this is a dangerous misconception",
          "Manual D design: Duct system designed for specific CFM distribution - closing vents breaks the design",
          'Static pressure increase: Closing vents increases static pressure, can exceed 0.6" WC limit',
          "Blower motor damage: High static pressure overworks blower motor, can cause failure within weeks",
          "Reduced efficiency: System works harder, uses more energy, reduces equipment lifespan",
          "Proper solutions: Use zoning system, close doors, or install separate system for unused areas",
          "If absolutely necessary: Only close 1-2 vents maximum, monitor system, check for overheating",
        ],
        warnings: {
          critical:
            "NEVER close more than 20% of vents - can cause immediate blower motor failure",
          damage:
            "High static pressure from closed vents can permanently damage blower motor",
          alternative:
            "Instead: close doors, use zoning, or install separate system",
        },
      },
    },
  },

  // ASHRAE Standard 55 - Thermal Comfort
  ashrae55: {
    title:
      "ASHRAE Standard 55 - Thermal Environmental Conditions for Human Occupancy",
    source: "ASHRAE Standard 55-2020",
    topics: {
      comfortZone: {
        summary: "ASHRAE 55 defines acceptable thermal comfort conditions.",
        keyConcepts: [
          "Operative temperature: average of air temp and mean radiant temp",
          "Winter comfort: 68-74°F operative temp at 30-60% RH",
          "Summer comfort: 73-79°F operative temp at 30-60% RH",
          "PMV/PPD: Predicted Mean Vote / Predicted Percentage Dissatisfied",
          "Acceptable range: 80% of occupants satisfied (PPD ≤ 20%)",
          "Clothing: 1.0 clo (winter), 0.5 clo (summer) typical",
          "Activity: 1.0 met (sedentary), 1.2 met (light activity)",
        ],
        recommendations: {
          winter: "68-72°F for occupied, 62-66°F for unoccupied/sleep",
          summer: "74-78°F for occupied, 78-82°F for unoccupied/sleep",
          humidity: "30-60% RH year-round for comfort and health",
        },
      },
      healthHumidity: {
        summary:
          "The Sterling Chart shows optimal humidity range (40-60% RH) for human health.",
        keyConcepts: [
          "Sterling Chart: Research shows 40-60% RH is the ideal zone for health - below 40% viruses and respiratory infections thrive, above 60% mold and dust mites thrive",
          "Below 40% RH: Increased risk of viral infections (influenza, cold viruses), respiratory irritation, dry skin",
          "Above 60% RH: Increased risk of mold growth, dust mite proliferation, bacterial growth",
          "Ideal range: 40-60% RH provides optimal balance between preventing pathogens (viruses, bacteria) and preventing mold/mites",
          "The Sterling Chart (or Sterling/ASHRAE relationship) indicates optimal humidity range for human health based on research",
          "ASHRAE Standard 55: Recommends 30-60% RH for comfort, but Sterling Chart shows 40-60% is optimal for health",
        ],
      },
      radiantAsymmetry: {
        summary:
          "Radiant asymmetry causes discomfort even when air temperature is acceptable.",
        keyConcepts: [
          "Mean Radiant Temperature (MRT): Average temperature of surrounding surfaces",
          "Cold window surfaces: Glass is typically 10-20°F colder than room air in winter",
          "Radiant heat loss: Your body radiates heat to cold surfaces (like windows), making you feel cold",
          "Draft sensation: Feeling cold near windows even when air temp is 72°F is due to radiant asymmetry",
          "ASHRAE 55 limit: Radiant asymmetry should not exceed 5°F for comfort",
          "Solution: Improve window insulation (double/triple pane, low-E), use window treatments",
          "Operative temp: If air is 72°F but window is 55°F, operative temp feels like 63-65°F",
          "This is why you feel cold near windows even when thermostat says 72°F",
        ],
        formulas: {
          operativeTemp: "T_operative = (T_air + T_radiant) / 2",
          radiantAsymmetry: "Asymmetry = |T_surface - T_air|",
        },
      },
      adaptiveComfort: {
        summary:
          "Adaptive comfort model accounts for occupant adaptation to outdoor conditions.",
        keyConcepts: [
          "Applicable when occupants control their environment (windows, clothing, fans)",
          "Comfort temp = 0.31 × T_outdoor + 17.8°C (roughly 0.31 × T_outdoor + 64°F)",
          "Acceptable range: ±2.5°C (±4.5°F) from comfort temp",
          "More flexible than PMV model for naturally ventilated spaces",
        ],
      },
    },
  },

  // ASHRAE Standard 62.2 - Ventilation
  ashrae622: {
    title:
      "ASHRAE Standard 62.2 - Ventilation and Acceptable Indoor Air Quality",
    source: "ASHRAE Standard 62.2-2019",
    topics: {
      ventilationRequirements: {
        summary:
          "ASHRAE 62.2 sets minimum ventilation rates for residential buildings.",
        keyConcepts: [
          "Whole-house ventilation: 0.03 CFM per sq ft + 7.5 CFM per bedroom",
          "Example: 2000 sq ft, 3 bedrooms = 60 + 22.5 = 82.5 CFM minimum",
          "Local exhaust: kitchen 100 CFM, bathroom 50 CFM (intermittent)",
          "Ventilation can be: exhaust-only, supply-only, or balanced (HRV/ERV)",
          "HRV/ERV: Heat/Energy Recovery Ventilator recovers 70-90% of energy",
          "Infiltration: natural air leakage can count toward ventilation if ≥ 0.35 ACH",
        ],
        calculations: {
          wholeHouse: "Q_vent = 0.03 × A_floor + 7.5 × N_bedrooms (CFM)",
          example:
            "2000 sq ft, 3 BR = 0.03 × 2000 + 7.5 × 3 = 60 + 22.5 = 82.5 CFM",
        },
      },
      airQuality: {
        summary: "Proper ventilation maintains indoor air quality.",
        keyConcepts: [
          "CO2 levels: < 1000 ppm acceptable, > 1000 ppm indicates poor ventilation",
          "CO2 at 1000ppm: Upper limit for 'good' air quality per ASHRAE 62.2",
          "CO2 above 1000ppm: Cognitive function declines, drowsiness, reduced productivity",
          "CO2 health effects: 1000-2000ppm = acceptable but not ideal, >2000ppm = poor air quality",
          "Ventilation requirement: ASHRAE 62.2 requires sufficient ventilation to keep CO2 < 1000ppm",
          "Humidity: 30-60% RH prevents mold growth and maintains comfort",
          "Pollutants: VOCs, radon, particulates reduced by proper ventilation",
          "Source control: eliminate sources (smoking, chemicals) before increasing ventilation",
        ],
        standards: {
          ashrae622:
            "ASHRAE 62.2: 1000ppm CO2 is the upper limit for acceptable indoor air quality",
        },
      },
    },
  },

  // DOE Guides and Best Practices
  doeGuides: {
    title: "DOE Energy Efficiency Guides",
    source: "U.S. Department of Energy",
    topics: {
      heatPumpEfficiency: {
        summary: "DOE provides guidance on heat pump efficiency and operation.",
        keyConcepts: [
          "HSPF2: Heating Seasonal Performance Factor (new rating system)",
          "HSPF2 ≥ 8.5: ENERGY STAR qualified",
          "COP: Coefficient of Performance = BTU output / BTU input (electric)",
          "COP at 47°F: typically 3.0-4.5 for modern heat pumps",
          "COP degradation: decreases as outdoor temp drops (COP ~2.0 at 17°F)",
          "Aux heat lockout: set to 30-40°F to maximize heat pump efficiency",
        ],
      },
      thermostatSettings: {
        summary: "DOE recommendations for thermostat programming.",
        keyConcepts: [
          "Setback savings: 1% per degree for 8 hours (heating), 3% per degree (cooling)",
          "Recommended: 68°F winter (occupied), 62°F (unoccupied)",
          "Recommended: 78°F summer (occupied), 85°F (unoccupied)",
          "Programmable thermostats: save 10-15% on heating, 15-20% on cooling",
          "Smart thermostats: additional 8-12% savings through learning and optimization",
        ],
      },
    },
  },

  // NREL BEopt and TMY3 Data
  nrelData: {
    title: "NREL Building Energy Optimization and TMY3 Weather Data",
    source: "National Renewable Energy Laboratory",
    topics: {
      tmy3Data: {
        summary:
          "TMY3 (Typical Meteorological Year) provides representative weather data for energy calculations.",
        keyConcepts: [
          "TMY3: 12 months of actual weather data selected to represent typical year",
          "Design temps: 99% heating (1% of hours colder), 1% cooling (1% of hours hotter)",
          "HDD/CDD: Heating/Cooling Degree Days for annual energy estimates",
          "Solar radiation: direct and diffuse components for load calculations",
          "Used in: Manual J load calcs, BEopt energy modeling, system sizing",
          "Source: NREL (National Renewable Energy Laboratory) maintains TMY3 database",
          "Forecast basis: 7-day cost forecasts use TMY3 data patterns combined with current weather",
        ],
      },
      balancePoint: {
        summary:
          "Balance point is the outdoor temperature where heat loss equals heat pump capacity.",
        keyConcepts: [
          "Definition: Outdoor temperature where home's Heat Loss = Heat Pump's Heating Capacity",
          "Below balance point: Heat pump alone cannot maintain temperature, aux heat required",
          "Above balance point: Heat pump can handle heating load without aux heat",
          "Calculation: Balance Point = f(Heat Loss Factor, Heat Pump Capacity, HSPF2, Outdoor Temp)",
          "Typical range: 25-40°F for most heat pump systems",
          "Source: NREL and OpenEnergyMonitor documentation on heat pump performance",
          "Critical for sizing: Determines how much aux heat capacity is needed",
        ],
        formulas: {
          balancePoint:
            "Balance Point = T where Heat_Loss(T) = Heat_Pump_Capacity(T)",
        },
      },
      thermalDecay: {
        summary:
          "Thermal decay describes how quickly a building loses heat when heating stops.",
        keyConcepts: [
          "Newton's Law of Cooling: Rate of temperature change is proportional to temperature difference",
          "Formula: dT/dt = -k × (T - T_ambient), where k is thermal decay constant",
          "Thermal decay constant: k = Heat_Loss_Factor / (Mass × Specific_Heat)",
          "Practical formula: ΔT/Δt = -Heat_Loss_Factor × ΔT / Thermal_Mass",
          "Example: If heat loss = 500 BTU/hr/°F and thermal mass = 50,000 BTU/°F, decay = 0.01 °F/min",
          "Application: Used to calculate how long building takes to cool down during setbacks",
          "Free heat: After compressor shuts off, residual heat in exchanger continues to heat home (thermal decay in reverse)",
          "Source: Physics/Thermodynamics - Newton's Law of Cooling applied to buildings",
        ],
        formulas: {
          newtonsLaw: "dT/dt = -k × (T - T_ambient)",
          thermalDecay: "ΔT/Δt = -Heat_Loss_Factor × ΔT / Thermal_Mass",
          timeToCool:
            "t = -ln((T_final - T_ambient) / (T_initial - T_ambient)) / k",
        },
      },
      energyModeling: {
        summary: "BEopt and similar tools model annual energy consumption.",
        keyConcepts: [
          "Hourly simulation: calculates energy use for each hour of the year",
          "Inputs: building envelope, equipment efficiency, thermostat schedule, weather",
          "Outputs: annual energy use, monthly bills, peak loads, comfort metrics",
          "Sensitivity analysis: shows which parameters most affect energy use",
        ],
      },
    },
  },

  // Equipment Specifications & Performance Data
  equipmentSpecs: {
    title: "HVAC Equipment Specifications & Performance Data",
    source:
      "Manufacturer Submittal Sheets, AHRI Certificates, Product Data Catalogs",
    // Example models (to be expanded with full database)
    exampleModels: {
      "Carrier-Infinity-19VS": {
        manufacturer: "Carrier",
        model: "Infinity 19VS",
        type: "Heat Pump",
        seer2: 19.5,
        hspf2: 10.5,
        cop: { "47F": 4.2, "17F": 2.8, "5F": 2.1, "-15F": 1.5 },
        capacity: { "47F": 36000, "17F": 28000, "5F": 22000, "-15F": 16000 },
        airflow: { min: 1200, max: 1800 },
        staticPressure: { max: 0.6 },
        refrigerant: { type: "R-410A", charge: 8.5 },
        soundLevel: { low: 52, medium: 58, high: 65 },
        source: "Carrier Product Data Sheet 2024",
      },
      "Mitsubishi-PUMY-P36NKMU2": {
        manufacturer: "Mitsubishi",
        model: "PUMY-P36NKMU2",
        type: "Cold-Climate Heat Pump",
        seer2: 18.5,
        hspf2: 11.5,
        cop: { "47F": 4.5, "17F": 3.2, "5F": 2.5, "-15F": 2.0 },
        capacity: { "47F": 36000, "17F": 32000, "5F": 28000, "-15F": 24000 },
        airflow: { min: 1000, max: 1600 },
        staticPressure: { max: 0.5 },
        refrigerant: { type: "R-410A", charge: 7.2 },
        soundLevel: { low: 48, medium: 55, high: 62 },
        source: "Mitsubishi Submittal Sheet 2024",
        neepCertified: true, // NEEP cold-climate certified
      },
    },
    topics: {
      performanceRatings: {
        summary:
          "Equipment performance ratings vary by temperature and operating conditions.",
        keyConcepts: [
          "HSPF2: Heating Seasonal Performance Factor (new rating system), measured at 47°F, 17°F, 5°F, and -15°F",
          "SEER2: Seasonal Energy Efficiency Ratio (new rating system), measured at 95°F outdoor, 80°F indoor",
          "COP: Coefficient of Performance = BTU output / BTU input (electric), varies with outdoor temperature",
          "EER: Energy Efficiency Ratio (instantaneous), EER ≈ SEER2 × 0.875",
          "Capacity degradation: Heat pump capacity decreases as outdoor temp drops (typically 50-60% at 5°F vs 47°F)",
          "Cold-climate performance: Look for capacity at 5°F and -15°F for cold-climate heat pumps",
          "AHRI ratings: Certified performance data available in AHRI Directory for matched systems",
          "Sound levels: Measured in dB(A) at different fan speeds (typically 50-70 dB(A) for residential units)",
        ],
        formulas: {
          cop: "COP = BTU_output / (kW_input × 3,412)",
          capacityFactor:
            "Capacity_factor = Capacity_at_temp / Capacity_at_47F",
        },
      },
      airflowSpecs: {
        summary:
          "Airflow and static pressure specifications are critical for proper system operation.",
        keyConcepts: [
          "CFM range: Minimum and maximum airflow (CFM) varies by unit size and fan speed",
          "Typical ranges: 1.5 ton = 600-900 CFM, 3 ton = 1,200-1,800 CFM, 5 ton = 2,000-3,000 CFM",
          'Static pressure: Maximum static pressure typically 0.5-0.8" WC for residential units',
          "Fan speeds: Multi-speed and variable-speed units have different CFM at each speed",
          "Low static: System may not deliver proper airflow if static pressure too low",
          "High static: Exceeding maximum static pressure causes blower stress and noise",
        ],
      },
      refrigerants: {
        summary:
          "Refrigerant type and charge amount are specified for each model.",
        keyConcepts: [
          "R-410A: Common refrigerant, being phased out, high GWP (Global Warming Potential)",
          "R-454B: Newer low-GWP alternative to R-410A (A2L mildly flammable)",
          "R-32: Low-GWP refrigerant used in some systems (A2L mildly flammable)",
          "Charge amount: Specified in ounces or pounds for each model (typically 3-15 lbs for residential)",
          "Critical: Must use exact refrigerant type specified - mixing refrigerants damages system",
          "Conversion: R-410A to R-454B conversions require specific procedures and may not be approved",
        ],
      },
    },
  },

  // Installation & Physical Requirements
  installationRequirements: {
    title: "Installation & Physical Requirements",
    source:
      "Installation, Operation & Maintenance (IOM) Manuals, Installer's Guides",
    topics: {
      clearances: {
        summary:
          "Minimum clearances to combustibles and service access are required for safety and maintenance.",
        keyConcepts: [
          'Outdoor units: Typically 12-24" clearance to walls, 36-48" for service access',
          'Indoor units: 6-12" clearance to walls, 30-36" for service access',
          'Combustibles: Minimum clearance to combustible materials (typically 1" for furnaces, 6" for heat pumps)',
          "Ventilation: Adequate clearance for air intake and exhaust (prevents recirculation)",
          "Code requirements: IMC (International Mechanical Code) and IRC specify minimum clearances",
          "Service access: Must allow technician access to all serviceable components",
        ],
      },
      lineSets: {
        summary:
          "Refrigerant line-set length and vertical rise affect system performance.",
        keyConcepts: [
          "Maximum length: Typically 50-100 feet depending on model (longer = capacity loss)",
          "Vertical rise: Maximum 50-80 feet depending on model (affects oil return)",
          "Minimum length: Some models require minimum 15-25 feet for proper operation",
          'Sizing: Line-set diameter must match unit specifications (typically 3/8" liquid, 5/8" or 3/4" suction)',
          "Capacity loss: Each 10 feet of line-set length reduces capacity by 0.5-1%",
          "Oil return: Vertical rise requires proper line-set sizing to ensure compressor oil return",
        ],
      },
      electrical: {
        summary: "Electrical requirements vary by unit size and efficiency.",
        keyConcepts: [
          "MCA: Minimum Circuit Ampacity - minimum wire size and breaker rating",
          "MOP: Maximum Overcurrent Protection - maximum breaker size allowed",
          "Voltage: Typically 208/230V single-phase for residential (some require 3-phase)",
          "Heat pumps: MCA typically 15-50 amps depending on size, MOP 20-60 amps",
          "Gas furnaces: 80% AFUE typically 15-20 amps, 96% AFUE (condensing) 20-30 amps",
          "Dual fuel: Requires separate circuits for heat pump and furnace",
          "Code: NEC (National Electrical Code) specifies requirements",
        ],
      },
      gasRequirements: {
        summary: "Gas furnaces require proper gas line sizing and venting.",
        keyConcepts: [
          "Gas line size: Depends on BTU input, distance from meter, and number of appliances",
          '80% furnaces: Typically 1/2" to 3/4" gas line depending on size (40k-150k BTU input)',
          "96% furnaces: Similar gas line requirements, but different venting (PVC instead of metal)",
          'Gas pressure: Required inlet pressure typically 5-7" WC for natural gas',
          "Venting: 80% = metal B-vent or chimney, 96% = PVC (category IV)",
          "Code: NFPA 54 (National Fuel Gas Code) specifies requirements",
        ],
      },
      dualFuel: {
        summary: "Dual-fuel systems combine heat pump with gas furnace backup.",
        keyConcepts: [
          "Compatibility: Not all heat pumps are approved for dual-fuel with all furnaces",
          "Control: Requires dual-fuel control board or compatible thermostat",
          "Switchover: Typically switches to gas at 30-40°F outdoor temperature",
          "Installation: Requires specific wiring and control setup per manufacturer",
          "Approved combinations: Check manufacturer matching tables for approved pairings",
        ],
      },
      drainRequirements: {
        summary:
          "Proper condensate drainage is required for indoor units in attics and basements.",
        keyConcepts: [
          "Primary drain: Required for all indoor units (air handlers, furnaces with A/C coils)",
          "Auxiliary drain: Required in attics and above finished spaces (safety backup)",
          'Drain pan: Must be sized for unit and have proper slope (1/4" per foot minimum)',
          "Code: IMC requires auxiliary drain pan in attics with float switch",
          "Freezing: Attic installations require heat tape or insulated drain lines in cold climates",
        ],
      },
    },
  },

  // Troubleshooting & Fault Codes
  troubleshooting: {
    title: "Troubleshooting & Fault Codes",
    source:
      "Service Manuals, Service Facts, Fault Code Guides, Technical Service Bulletins",
    // Example fault codes (to be expanded with full database)
    exampleFaultCodes: {
      Carrier: {
        E1: {
          meaning: "Indoor temperature sensor fault",
          causes: [
            "Sensor disconnected",
            "Sensor shorted",
            "Sensor out of range",
          ],
          solution: "Check sensor wiring, replace if faulty",
          source: "Carrier Service Manual 2024",
        },
        E5: {
          meaning: "Communication error between indoor and outdoor units",
          causes: ["Loose connection", "Damaged wire", "Control board fault"],
          solution: "Check communication wire, verify connections",
          source: "Carrier Service Manual 2024",
        },
        dF: {
          meaning: "Defrost fault",
          causes: [
            "Defrost sensor fault",
            "Outdoor coil frozen",
            "Defrost timer fault",
          ],
          solution: "Check defrost sensor, verify defrost operation",
          source: "Carrier Service Manual 2024",
        },
      },
      Trane: {
        "5 flashes": {
          meaning: "Low pressure switch open",
          causes: ["Low refrigerant", "Restriction", "Faulty switch"],
          solution: "Check refrigerant charge, verify switch operation",
          source: "Trane Service Facts 2024",
        },
        "3 flashes": {
          meaning: "High pressure switch open",
          causes: ["Overcharge", "Restriction", "Faulty switch"],
          solution: "Check refrigerant charge, verify switch operation",
          source: "Trane Service Facts 2024",
        },
      },
      Lennox: {
        E200: {
          meaning: "Indoor temperature sensor fault",
          causes: ["Sensor disconnected", "Sensor shorted"],
          solution: "Check sensor wiring, replace if faulty",
          source: "Lennox Service Manual 2024",
        },
        E223: {
          meaning: "Outdoor temperature sensor fault",
          causes: ["Sensor disconnected", "Sensor shorted"],
          solution: "Check sensor wiring, replace if faulty",
          source: "Lennox Service Manual 2024",
        },
      },
    },
    topics: {
      faultCodes: {
        summary:
          "Fault codes indicate specific system problems requiring diagnosis.",
        keyConcepts: [
          "Format varies: LED flashes, error codes (E1, E5, etc.), alphanumeric (dF, Lo, Hi)",
          "Common codes: E1 = sensor fault, E5 = communication error, dF = defrost fault, Lo = low pressure",
          "Brand-specific: Each manufacturer uses different fault code systems",
          "Service manuals: Complete fault code lists available in manufacturer service manuals",
          "TSBs: Technical Service Bulletins provide updated fault code information and fixes",
        ],
      },
      coldAirInHeating: {
        summary:
          "Heat pump blowing cold air in heating mode has several possible causes.",
        keyConcepts: [
          "Defrost cycle: Normal - heat pump reverses to defrost outdoor coil (5-10 minutes)",
          "Outdoor temp too low: Below balance point, system may need aux heat",
          "Reversing valve stuck: Valve not switching properly, requires service",
          "Low refrigerant: Insufficient charge causes poor heating performance",
          "Outdoor coil frozen: Ice buildup prevents heat transfer, check defrost operation",
          "Thermostat setting: Verify heat mode is selected, not cool or auto",
        ],
      },
      ignitionProblems: {
        summary:
          "Furnace ignition problems have specific diagnostic procedures.",
        keyConcepts: [
          "Ignitor glows but no flame: Top 5 causes: 1) Gas valve not opening, 2) No gas supply, 3) Flame sensor dirty, 4) Pressure switch fault, 5) Control board fault",
          "Flame sensor test: Measure microamps (typically 2-10 μA when flame present)",
          "Inducer motor test: Check for proper operation, verify pressure switch activation",
          "Pressure switch test: Should close when inducer runs (continuity test)",
          "Gas valve: Verify 24V signal from control board, check gas supply pressure",
          "Control board: Check for error codes, verify all safety circuits closed",
        ],
      },
      diagnosticProcedures: {
        summary: "Systematic diagnostic procedures for common components.",
        keyConcepts: [
          "Flame sensor: Clean with fine sandpaper, measure microamps (should be 2-10 μA)",
          "Inducer motor: Check for proper rotation, measure amp draw (compare to nameplate)",
          "Pressure switch: Blow into tube - should hear click, verify continuity when closed",
          "Thermocouple/thermopile: Measure millivolts (should be 10-30 mV for standing pilot)",
          "Gas valve: Measure 24V at valve terminals when calling for heat",
          "Control board: Check for diagnostic LEDs, verify all inputs (safety circuits)",
        ],
      },
    },
  },

  // Compatibility & Matching
  compatibility: {
    title: "Equipment Compatibility & Matching",
    source:
      "AHRI Directory, Manufacturer Matching Tables, Approved Combinations Lists",
    topics: {
      ahriMatching: {
        summary:
          "AHRI Directory certifies matched combinations of outdoor and indoor units.",
        keyConcepts: [
          "AHRI number: Unique identifier for each matched system (e.g., 12345678)",
          "Approved combinations: Only specific outdoor/indoor coil combinations are certified",
          "Performance: AHRI ratings show actual SEER2/HSPF2 for the matched combination",
          "Mixing brands: Generally not recommended - use manufacturer-approved combinations",
          "Database: Full AHRI Directory contains ~15-20 GB of certified combination data",
          "Verification: Always verify AHRI number matches your specific combination",
        ],
      },
      variableSpeedMatching: {
        summary:
          "Variable-speed furnaces can be matched with single-stage heat pumps in some cases.",
        keyConcepts: [
          "Compatibility: Depends on control board and thermostat compatibility",
          "Fan control: Variable-speed furnace can provide better airflow control",
          "Efficiency: Variable-speed fan improves overall system efficiency",
          "Approval: Check manufacturer matching tables for approved combinations",
          "Control: May require specific control board or thermostat for proper operation",
        ],
      },
      refrigerantCompatibility: {
        summary:
          "Evaporator coils must be rated for the refrigerant used in the system.",
        keyConcepts: [
          "R-410A coils: Cannot be used with R-454B or R-32 systems",
          "R-454B compatibility: Coil must be specifically rated for R-454B",
          "R-32 compatibility: Coil must be specifically rated for R-32",
          "Conversion: Converting R-410A system to R-454B requires coil replacement",
          "Critical: Using wrong refrigerant in coil can cause leaks and system failure",
        ],
      },
    },
  },

  // Sizing & Load Calculation Support
  sizingSupport: {
    title: "Sizing & Load Calculation Support",
    source:
      "ACCA Manual J/S/D, Manufacturer Sizing Guides, NEEP Cold-Climate Data",
    topics: {
      manualJSizing: {
        summary:
          "Manual J provides the standard method for calculating heating and cooling loads.",
        keyConcepts: [
          "Load calculation: Determines required equipment capacity based on building characteristics",
          "Heating load: Calculated at 99% design temperature (1% of hours colder)",
          "Cooling load: Calculated at 1% design temperature (1% of hours hotter)",
          "Example: 2,200 sq ft home in Chicago (Zone 5) typically needs 2.5-3.5 tons cooling, 60k-90k BTU heating",
          "Factors: Square footage, insulation, windows, orientation, infiltration, internal gains",
          "Software: Manual J calculations done with software (Wrightsoft, CoolCalc, Manual J 8th Ed)",
        ],
      },
      coldClimateSizing: {
        summary:
          "Cold-climate heat pumps require capacity verification at low temperatures.",
        keyConcepts: [
          "5°F capacity: Cold-climate heat pumps maintain 70-100% of rated capacity at 5°F",
          "0°F capacity: Some models maintain 50-70% capacity at 0°F",
          "NEEP data: NEEP ccASHP list provides capacity at 5°F for certified cold-climate models",
          "Zone 5 sizing: 3-ton heat pump in Zone 5 should maintain capacity at 0°F for most homes",
          "Backup sizing: Gas furnace backup typically sized for design temp minus heat pump capacity",
          "Example: 4-ton cold-climate heat pump may need 40k-60k BTU gas backup in Zone 5",
        ],
      },
      typicalSizing: {
        summary: "Typical equipment sizes for common home sizes and climates.",
        keyConcepts: [
          "Rule of thumb: 1 ton per 400-600 sq ft (varies by climate and insulation)",
          "Zone 1-2 (hot): 1 ton per 400-500 sq ft",
          "Zone 3-4 (moderate): 1 ton per 500-600 sq ft",
          "Zone 5-7 (cold): 1 ton per 600-800 sq ft (with cold-climate heat pump)",
          "Gas backup: Typically 40k-80k BTU for 3-5 ton heat pump systems",
          "Important: Always use Manual J for accurate sizing - rules of thumb are rough estimates",
        ],
      },
    },
  },

  // Energy Efficiency, Rebates & Regulatory
  energyEfficiency: {
    title: "Energy Efficiency, Rebates & Regulatory Compliance",
    source:
      "ENERGY STAR Lists, CEE Tier Lists, IRS 25C Database, DOE Regulations",
    topics: {
      taxCredits: {
        summary:
          "Federal and state tax credits are available for high-efficiency HVAC equipment.",
        keyConcepts: [
          "25C Tax Credit: $2,000 federal tax credit for qualified heat pumps (2023-2032)",
          "Qualification: Heat pump must meet SEER2 ≥ 16, HSPF2 ≥ 9, EER ≥ 12",
          "ENERGY STAR Most Efficient: Highest tier, qualifies for maximum rebates",
          "State rebates: Vary by state, check local utility and state energy office",
          "IRS Database: IRS maintains list of 25C qualified products",
          "Documentation: Keep receipts and AHRI certificate for tax filing",
        ],
      },
      seerVsSeer2: {
        summary: "SEER2 is the new rating system replacing SEER (2023).",
        keyConcepts: [
          'SEER2: New rating system accounts for higher external static pressure (0.5" vs 0.1")',
          "SEER vs SEER2: SEER2 ratings are typically 1-2 points lower than SEER for same unit",
          "Example: Unit rated SEER 18 = approximately SEER2 16-17",
          "Requirement: All units sold after 2023 must use SEER2 ratings",
          "Comparison: Cannot directly compare SEER to SEER2 - use same rating system",
        ],
      },
      doeRegulations: {
        summary:
          "DOE regulations set minimum efficiency standards for HVAC equipment.",
        keyConcepts: [
          "May 2025 Rule: New minimum AFUE 95% for gas furnaces in Northern region",
          "Regional standards: Different minimums for North (95% AFUE) vs South (80% AFUE)",
          "Compliance: Only new installations must meet new standards - existing units grandfathered",
          "Heat pumps: Minimum SEER2 14.3, HSPF2 7.5 (2023 standards)",
          "Enforcement: Manufacturers must certify compliance, installers must verify",
        ],
      },
      energyStar: {
        summary:
          "ENERGY STAR certification indicates high-efficiency equipment.",
        keyConcepts: [
          "Heat pumps: SEER2 ≥ 16, HSPF2 ≥ 9, EER ≥ 12 for ENERGY STAR",
          "Most Efficient: Highest tier, SEER2 ≥ 18, HSPF2 ≥ 10",
          "Gas furnaces: AFUE ≥ 95% for ENERGY STAR",
          "Benefits: Lower operating costs, may qualify for rebates and tax credits",
          "Database: ENERGY STAR product finder lists all certified models",
        ],
      },
    },
  },

  // Parts & Replacement
  partsReplacement: {
    title: "Parts & Replacement Components",
    source: "Parts Catalogs, Replacement Component Guides, Supersession Tables",
    topics: {
      partNumbers: {
        summary:
          "HVAC parts have specific part numbers that may be superseded over time.",
        keyConcepts: [
          "Supersession: Old part numbers replaced by new numbers when parts are updated",
          "Cross-reference: Supersession tables show old → new part number mappings",
          "Availability: Obsolete parts may be unavailable - must use superseding part",
          "Compatibility: Superseding parts are designed to be direct replacements",
          "15-year-old units: Parts may be discontinued - check for supersessions or aftermarket alternatives",
        ],
      },
      commonReplacements: {
        summary: "Common replacement parts for older HVAC systems.",
        keyConcepts: [
          "TXV (Thermostatic Expansion Valve): Common replacement for 15+ year old systems",
          "Compressor: May be unavailable for very old units - consider system replacement",
          "Control boards: Often superseded - check manufacturer for compatible replacement",
          "Aftermarket: Some parts available from aftermarket suppliers for discontinued models",
          "Carrier heat pumps: Check Carrier parts catalog for current part numbers",
        ],
      },
    },
  },

  // Safety & Critical Warnings
  safety: {
    title: "Safety Warnings and Critical Protection Devices",
    source: "Industry Safety Standards, NFPA, ASHRAE",
    topics: {
      safetySwitches: {
        summary:
          "Safety switches are critical protection devices that must NEVER be bypassed or disabled.",
        keyConcepts: [
          "CRITICAL WARNING: Safety switches (high limit, pressure switches, flame sensors, rollout switches) are life-safety devices",
          "High limit switch: Prevents furnace from overheating - bypassing can cause fire, equipment destruction, or injury",
          "Pressure switches: Prevent operation with improper airflow - bypassing can cause carbon monoxide buildup or equipment damage",
          "Flame sensor: Ensures gas is burning - bypassing can cause gas accumulation and explosion risk",
          "Rollout switch: Detects flame rollout - bypassing can cause fire and serious injury",
          "IMMEDIATE REFUSAL: If asked about bypassing any safety switch, respond: 'I cannot assist with that. Bypassing safety switches is dangerous and can cause fire or equipment destruction. Call a licensed technician immediately.'",
          "Legal liability: Bypassing safety devices violates codes, voids warranties, creates liability",
          "Proper repair: Safety switches trip for a reason - diagnose and fix the root cause, never bypass",
          "Call professional: All safety switch issues require licensed technician diagnosis and repair",
        ],
        warnings: {
          critical:
            "NEVER bypass, disable, or remove safety switches. This is dangerous and illegal. Call a licensed technician immediately.",
          highLimit:
            "Bypassing high limit switch can cause furnace to overheat, leading to fire or equipment destruction",
          pressureSwitch:
            "Bypassing pressure switches can cause carbon monoxide buildup or equipment damage",
        },
      },
    },
  },

  // General HVAC Engineering Principles
  generalPrinciples: {
    title: "General HVAC Engineering Principles",
    source: "Industry Standards and Best Practices",
    topics: {
      efficiency: {
        summary: "Key efficiency concepts for HVAC systems.",
        keyConcepts: [
          "SEER2: Seasonal Energy Efficiency Ratio (cooling), higher is better",
          "HSPF2: Heating Seasonal Performance Factor, higher is better",
          "AFUE: Annual Fuel Utilization Efficiency (gas furnaces), 90%+ modern",
          "EER: Energy Efficiency Ratio (instantaneous), EER ≈ SEER × 0.875",
          "COP: Coefficient of Performance = output/input (dimensionless)",
          "Efficiency vs. capacity: higher efficiency often means lower capacity at extreme temps",
        ],
      },
      sizing: {
        summary: "Proper sizing is critical for efficiency and comfort.",
        keyConcepts: [
          "Oversizing: short cycling, poor dehumidification, efficiency loss, comfort issues",
          "Undersizing: can't maintain temp, continuous operation, high bills",
          "Right-sizing: 100-115% of calculated load (Manual J/S)",
          "Multi-stage: better efficiency and comfort than single-stage",
          "Variable-speed: best efficiency and comfort, but higher cost",
        ],
      },
      operation: {
        summary: "Optimal operation strategies for efficiency and comfort.",
        keyConcepts: [
          "Setback strategy: 4-6°F setback for 8+ hours saves 5-10%",
          "Aux heat lockout: 30-40°F maximizes heat pump efficiency",
          "Compressor lockout: 0-20°F prevents damage, but may need aux heat",
          "Fan operation: continuous low-speed improves comfort and air quality",
          "Filter maintenance: change every 1-3 months for efficiency and IAQ",
        ],
      },
      shortCycling: {
        summary:
          "Short cycling is excessive on/off cycling that damages equipment and reduces efficiency. Why it happens: System reaches setpoint too quickly, then shuts off before properly conditioning the space.",
        keyConcepts: [
          "NEMA MG-1 standard: Short cycling defined as >3 cycles per hour with <5 minutes runtime per cycle",
          "Primary Causes: 1) Oversized equipment (>20% above calculated load) - most common cause, 2) Incorrect differential settings (too tight temperature band), 3) Poor load matching (equipment capacity much higher than actual heat loss/gain), 4) Low airflow (dirty filters, blocked ducts), 5) Thermostat placement (near vents, sunlight, or heat sources)",
          "Why oversized equipment causes it: System produces too much cooling/heating too quickly, satisfies thermostat in 2-5 minutes, shuts off before dehumidifying or properly circulating air, then restarts when temperature drifts slightly",
          "Why tight differentials cause it: Thermostat activates on tiny temperature swings (0.5-1°F), system can't run long enough to stabilize before hitting setpoint again",
          "Why low airflow causes it: Reduced airflow makes system think it's working harder than it is, compressor cycles on/off rapidly trying to maintain temperature",
          "Symptoms you'll notice: System turns on/off frequently (every 5-10 minutes), high energy bills despite frequent operation, poor humidity control (especially in summer), temperature swings, unusual noises from frequent starts",
          "Effects: 10-15% efficiency loss from startup energy waste, increased wear on compressor (most vulnerable component), reduced equipment lifespan (50% reduction in compressor life), poor dehumidification in cooling mode, higher electricity bills",
          "Detection: Monitor runtime logs - if >3 cycles/hour with <5 min runtime, system is short cycling. Check thermostat history for frequent on/off patterns",
          "Solutions: 1) Verify proper sizing using Manual J/S calculations - equipment should be 100-115% of calculated load (max 120%), 2) Adjust differential settings - widen deadband to 2-3°F, 3) Check airflow - replace filters, inspect ducts for blockages, verify blower speed, 4) Consider multi-stage equipment - first stage handles 60-70% of load for better load matching, 5) Verify thermostat placement - away from vents, sunlight, and heat sources",
          "Minimum runtime: Compressor should run at least 5-10 minutes per cycle for efficiency and proper dehumidification. Systems that regularly run less than 5 minutes are short cycling",
          "Prevention: Always perform Manual J load calculation before selecting equipment, avoid 'bigger is better' mentality, verify airflow during installation, use proper thermostat differential settings (2-3°F minimum)",
        ],
        standards: {
          nemaMG1:
            "NEMA MG-1: Standard for motors and generators - defines acceptable cycling rates for HVAC equipment. More than 3 cycles per hour with less than 5 minutes runtime per cycle indicates short cycling",
        },
      },
      heatDissipation: {
        summary:
          "Heat dissipation time allows scavenging residual heat from the heat exchanger after compressor shutdown.",
        keyConcepts: [
          "Free heat concept: After compressor shuts off, heat exchanger retains residual heat (typically 5-15 minutes)",
          "Heat dissipation time: Delay before allowing compressor to restart, allowing residual heat to transfer indoors",
          "Benefits: Scavenges 'free' heat without running compressor, improves efficiency by 2-5%",
          "Trade-off: Longer dissipation time = more free heat but slower recovery from setbacks",
          "Recommended: 30-60 seconds typical, adjust based on comfort vs efficiency priorities",
          "Too short: Wastes residual heat, reduces efficiency",
          "Too long: Slower recovery, may need aux heat for large setbacks",
          "Calculation: Based on heat exchanger thermal mass and heat loss rate",
        ],
      },
      economicBalancePoint: {
        summary:
          "Economic balance point determines when heat pump is cheaper to run than gas furnace based on utility rates.",
        keyConcepts: [
          "Economic balance point: Outdoor temperature where heat pump cost = gas furnace cost",
          "Formula: Economic BP = (Gas Cost per BTU) / (Electric Cost per BTU × COP)",
          "Gas cost per BTU: (Gas rate $/therm) / 100,000 BTU per therm",
          "Electric cost per BTU: (Electric rate $/kWh) / 3,412 BTU per kWh",
          "COP degradation: COP decreases as outdoor temp drops (typically 3.0 at 47°F, 2.0 at 17°F)",
          "Above economic BP: Heat pump is cheaper, use heat pump",
          "Below economic BP: Gas furnace may be cheaper, but consider comfort and aux heat availability",
          "Example: $0.15/kWh electric, $2.50/therm gas, COP 3.0 → Economic BP ≈ 25°F",
        ],
        formulas: {
          economicBalancePoint:
            "Economic BP = (Gas $/therm / 100,000) / (Electric $/kWh / 3,412 × COP)",
          gasCostPerBTU:
            "Gas Cost/BTU = Gas Rate ($/therm) / 100,000 BTU/therm",
          electricCostPerBTU:
            "Electric Cost/BTU = Electric Rate ($/kWh) / 3,412 BTU/kWh",
        },
      },
    },
  },
};

/**
 * Search the knowledge base for relevant information
 * @param {string} query - Search query
 * @returns {Array} Array of relevant knowledge snippets
 */
export function searchKnowledgeBase(query) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  // Extract keywords from query
  const keywords = lowerQuery
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .map((word) => word.replace(/[^\w]/g, ""));

  // Check for model-specific queries (e.g., "Carrier Infinity 19VS", "model XYZ")
  const modelMatch = lowerQuery.match(
    /(?:model|unit)\s+([a-z0-9-]+)|([a-z]+)\s+([a-z0-9-]+)/i
  );
  const manufacturerMatch = lowerQuery.match(
    /(carrier|trane|lennox|daikin|mitsubishi|fujitsu|lg|samsung|bosch|gree|midea|rheem|ruud|york|goodman|amana|bryant|american\s+standard|nordyne|payne|heil|tempstar|comfortmaker|arcoaire|keeprite)/i
  );

  // Check for fault code queries (e.g., "E5", "5 flashes", "fault code E1")
  const faultCodeMatch = lowerQuery.match(
    /(?:fault\s+code|error\s+code|code)\s*([a-z0-9]+|[\d]+\s+flashes?)/i
  );
  const brandMatch = lowerQuery.match(
    /(carrier|trane|lennox|daikin|mitsubishi|fujitsu|lg|samsung|bosch|gree|midea|rheem|ruud|york|goodman|amana|bryant|american\s+standard|nordyne|payne|heil|tempstar|comfortmaker|arcoaire|keeprite)/i
  );

  // Search equipment specifications if model/manufacturer mentioned
  if (modelMatch || manufacturerMatch) {
    const equipmentSpecs = HVAC_KNOWLEDGE_BASE.equipmentSpecs;
    if (equipmentSpecs?.exampleModels) {
      for (const [, modelData] of Object.entries(
        equipmentSpecs.exampleModels
      )) {
        const modelName =
          `${modelData.manufacturer} ${modelData.model}`.toLowerCase();
        if (
          modelName.includes(lowerQuery) ||
          lowerQuery.includes(modelData.manufacturer?.toLowerCase())
        ) {
          // Format model specifications
          let specText = `${modelData.manufacturer} ${modelData.model} (${modelData.type}):\n`;
          if (modelData.seer2) specText += `SEER2: ${modelData.seer2}\n`;
          if (modelData.hspf2) specText += `HSPF2: ${modelData.hspf2}\n`;
          if (modelData.cop) {
            specText += `COP: ${Object.entries(modelData.cop)
              .map(([temp, cop]) => `${temp}: ${cop}`)
              .join(", ")}\n`;
          }
          if (modelData.capacity) {
            specText += `Capacity: ${Object.entries(modelData.capacity)
              .map(([temp, cap]) => `${temp}: ${cap} BTU/hr`)
              .join(", ")}\n`;
          }
          if (modelData.airflow) {
            specText += `Airflow: ${modelData.airflow.min}-${modelData.airflow.max} CFM\n`;
          }
          if (modelData.refrigerant) {
            specText += `Refrigerant: ${modelData.refrigerant.type}, Charge: ${modelData.refrigerant.charge} lbs\n`;
          }
          if (modelData.soundLevel) {
            specText += `Sound Level: Low ${modelData.soundLevel.low} dB(A), High ${modelData.soundLevel.high} dB(A)\n`;
          }
          specText += `Source: ${
            modelData.source || "Manufacturer Data Sheet"
          }`;

          results.push({
            section: "equipmentSpecs",
            topic: "modelSpecifications",
            title: `${modelData.manufacturer} ${modelData.model} Specifications`,
            source: modelData.source || "Manufacturer Data Sheet",
            summary: specText,
            keyConcepts: [specText],
            relevanceScore: 10, // High relevance for model-specific queries
          });
        }
      }
    }
  }

  // Search fault codes if fault code mentioned
  if (faultCodeMatch) {
    const troubleshooting = HVAC_KNOWLEDGE_BASE.troubleshooting;
    if (troubleshooting?.exampleFaultCodes) {
      const code =
        faultCodeMatch[1]?.toLowerCase() || faultCodeMatch[0]?.toLowerCase();
      const brand = brandMatch ? brandMatch[1]?.toLowerCase() : null;

      // Search all brands if no specific brand mentioned, or specific brand if mentioned
      const brandsToSearch = brand
        ? [brand]
        : Object.keys(troubleshooting.exampleFaultCodes);

      for (const brandName of brandsToSearch) {
        const brandCodes = troubleshooting.exampleFaultCodes[brandName];
        if (brandCodes) {
          for (const [codeKey, codeData] of Object.entries(brandCodes)) {
            if (
              codeKey.toLowerCase().includes(code) ||
              code.includes(codeKey.toLowerCase())
            ) {
              let faultText = `${
                brandName.charAt(0).toUpperCase() + brandName.slice(1)
              } Fault Code ${codeKey}:\n`;
              faultText += `Meaning: ${codeData.meaning}\n`;
              faultText += `Causes: ${codeData.causes.join(", ")}\n`;
              faultText += `Solution: ${codeData.solution}\n`;
              faultText += `Source: ${codeData.source}`;

              results.push({
                section: "troubleshooting",
                topic: "faultCodes",
                title: `${
                  brandName.charAt(0).toUpperCase() + brandName.slice(1)
                } Fault Code ${codeKey}`,
                source: codeData.source,
                summary: faultText,
                keyConcepts: [faultText],
                relevanceScore: 10, // High relevance for fault code queries
              });
            }
          }
        }
      }
    }
  }

  // Search through all knowledge sections
  for (const [sectionKey, section] of Object.entries(HVAC_KNOWLEDGE_BASE)) {
    // Skip equipmentSpecs.exampleModels (already handled above)
    if (sectionKey === "equipmentSpecs" && section.exampleModels) {
      // Continue to topics
    }

    for (const [topicKey, topic] of Object.entries(section.topics || {})) {
      // Check if query matches section or topic
      const sectionMatch =
        sectionKey.toLowerCase().includes(lowerQuery) ||
        section.title.toLowerCase().includes(lowerQuery);
      // Convert camelCase topicKey to words BEFORE lowercasing (e.g., "shortCycling" -> "short cycling")
      const topicKeyAsWords = topicKey
        .replace(/([A-Z])/g, " $1")
        .trim()
        .toLowerCase();

      const topicMatch =
        topicKey.toLowerCase().includes(lowerQuery) ||
        topic.summary?.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(topicKeyAsWords) ||
        topicKeyAsWords.split(/\s+/).every((word) => lowerQuery.includes(word));

      // Check keyword matches in content
      const contentText = JSON.stringify(topic).toLowerCase();
      const keywordMatches = keywords.filter((kw) => contentText.includes(kw));

      // Also check if query contains key terms from camelCase topic keys (e.g., "short cycling" from "shortCycling")
      const topicKeyWords = topicKeyAsWords
        .split(/\s+/)
        .filter((w) => w.length > 2);
      const queryContainsTopicKeyWords =
        topicKeyWords.length > 0 &&
        topicKeyWords.every(
          (word) =>
            lowerQuery.includes(word) ||
            keywords.some((kw) => kw.includes(word) || word.includes(kw))
        );

      if (
        sectionMatch ||
        topicMatch ||
        keywordMatches.length > 0 ||
        queryContainsTopicKeyWords
      ) {
        results.push({
          section: sectionKey,
          topic: topicKey,
          title: `${section.title} - ${topicKey}`,
          source: section.source,
          summary: topic.summary,
          keyConcepts: topic.keyConcepts || [],
          formulas: topic.formulas || {},
          recommendations: topic.recommendations || {},
          relevanceScore:
            (sectionMatch ? 3 : 0) +
            (topicMatch ? 2 : 0) +
            (queryContainsTopicKeyWords ? 3 : 0) +
            keywordMatches.length,
        });
      }
    }
  }

  // Sort by relevance score (highest first)
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results.slice(0, 5); // Return top 5 results
}

/**
 * Format knowledge results for LLM context
 * @param {Array} results - Search results from searchKnowledgeBase
 * @returns {string} Formatted text for LLM
 */
export function formatKnowledgeForLLM(results) {
  if (results.length === 0) {
    return "No relevant HVAC engineering knowledge found.";
  }

  let formatted = "RELEVANT HVAC ENGINEERING KNOWLEDGE:\n\n";

  for (const result of results) {
    formatted += `[${result.source}] ${result.title}\n`;
    formatted += `${result.summary}\n\n`;

    if (result.keyConcepts && result.keyConcepts.length > 0) {
      formatted += "Key Concepts:\n";
      result.keyConcepts.forEach((concept, idx) => {
        formatted += `  ${idx + 1}. ${concept}\n`;
      });
      formatted += "\n";
    }

    if (result.formulas && Object.keys(result.formulas).length > 0) {
      formatted += "Formulas:\n";
      for (const [name, formula] of Object.entries(result.formulas)) {
        formatted += `  ${name}: ${formula}\n`;
      }
      formatted += "\n";
    }

    if (
      result.recommendations &&
      Object.keys(result.recommendations).length > 0
    ) {
      formatted += "Recommendations:\n";
      for (const [key, value] of Object.entries(result.recommendations)) {
        formatted += `  ${key}: ${value}\n`;
      }
      formatted += "\n";
    }

    formatted += "---\n\n";
  }

  return formatted;
}
