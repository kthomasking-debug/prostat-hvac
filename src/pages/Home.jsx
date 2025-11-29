import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  Home,
  Calendar,
  TrendingUp,
  Activity,
  Zap,
  BarChart3,
  Info,
  X,
  Lightbulb,
  Settings as SettingsIcon,
  CheckCircle2,
  Flame,
  Snowflake,
  Fan,
  Circle,
  Wifi,
  Cpu,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import AskJoule from "../components/AskJoule";
import DemoModeBanner from "../components/DemoModeBanner";
import { useDemoMode } from "../hooks/useDemoMode";
import {
  getAnnualHDD,
  getAnnualCDD,
  calculateAnnualHeatingCostFromHDD,
  calculateAnnualCoolingCostFromCDD,
} from "../lib/hddData";
import computeAnnualPrecisionEstimate from "../lib/fullPrecisionEstimate";

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("safeParse failed for key", key, error);
    return fallback;
  }
};

const currency = (v) => `$${(v ?? 0).toFixed(2)}`;

const HomeDashboard = () => {
  const [showHeatLossTooltip, setShowHeatLossTooltip] = React.useState(false);

  const lastForecast = useMemo(
    () => safeParse("last_forecast_summary", null),
    []
  );
  const resultsHistory = useMemo(() => safeParse("spa_resultsHistory", []), []);
  const latestAnalysis =
    resultsHistory && resultsHistory.length > 0
      ? resultsHistory[resultsHistory.length - 1]
      : null;
  const userLocation = useMemo(() => safeParse("userLocation", null), []);

  // Retrieve outlet context (routing state). Simplicity preferred over memoization to avoid hook rule violations.
  const outlet = useOutletContext() || {};
  // Support both new userSettings shape and legacy direct setters
  const { userSettings: ctxUserSettings } = outlet;
  const userSettings = React.useMemo(() => {
    return (
      ctxUserSettings ||
      (typeof outlet.primarySystem !== "undefined" ? { ...outlet } : {})
    );
  }, [ctxUserSettings, outlet]);
  const setHeatLossFactor = outlet.setHeatLossFactor;
  const globalHomeElevation =
    typeof userSettings?.homeElevation === "number"
      ? userSettings.homeElevation
      : typeof outlet.homeElevation === "number"
      ? outlet.homeElevation
      : userLocation && typeof userLocation.elevation === "number"
      ? userLocation.elevation
      : undefined;
  const [precisionEstimate, setPrecisionEstimate] = React.useState(null);
  const [precisionLoading, setPrecisionLoading] = React.useState(false);
  const [precisionError, setPrecisionError] = React.useState(null);

  // Memoize settings object to avoid hook dependency churn warnings
  const settings = React.useMemo(() => userSettings || {}, [userSettings]);
  // Manual Building Heat Loss estimator for Home page
  const [showBuildingHeatLoss, setShowBuildingHeatLoss] = React.useState(false);
  const [squareFeetLocal, setSquareFeetLocal] = React.useState(
    settings.squareFeet || 1500
  );
  const [ceilingHeightLocal, setCeilingHeightLocal] = React.useState(
    settings.ceilingHeight || 8
  );
  const [insulationLevelLocal, setInsulationLevelLocal] = React.useState(
    settings.insulationLevel || 1.0
  );
  const [homeShapeLocal, setHomeShapeLocal] = React.useState(
    settings.homeShape || 1.0
  );

  // Mission Control Center State
  const [currentTemp, setCurrentTemp] = useState(72);
  const [systemStatus, setSystemStatus] = useState("HEAT ON");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [eventLog, setEventLog] = useState([
    { time: "10:30 AM", message: "Optimization: Skipped short cycle.", type: "info" },
    { time: "10:15 AM", message: "Outdoor temp dropped to 32°F. Locking out Heat Pump.", type: "warning" },
    { time: "10:00 AM", message: "System check passed.", type: "success" },
  ]);
  const eventLogRef = useRef(null);
  const navigate = useNavigate();
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      return localStorage.getItem('demoBannerDismissed') === 'true';
    } catch {
      return false;
    }
  });
  
  // Demo mode hook
  const { isDemo, demoData, proAccess } = useDemoMode();

  // Simulate temperature changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prev) => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(68, Math.min(76, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll event log
  useEffect(() => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = 0;
    }
  }, [eventLog]);

  // Generate sparkline data (last 4 hours, 48 points)
  const sparklineData = useMemo(() => {
    const data = [];
    const baseTemp = currentTemp;
    for (let i = 47; i >= 0; i--) {
      const variance = (Math.sin(i / 8) + Math.random() * 0.3) * 1.5;
      data.push(baseTemp + variance);
    }
    return data;
  }, [currentTemp]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationResults({
        inefficiencies: 3,
        savings: 42,
        fixes: [
          "Lockout temperature set too high",
          "Short cycle protection disabled",
          "Aux heat threshold needs adjustment",
        ],
      });
      setShowOptimizeModal(true);
      // Add event to log
      setEventLog((prev) => [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: "Optimization analysis complete. 3 inefficiencies found.", type: "info" },
        ...prev,
      ]);
    }, 2000);
  };

  // Debugging hook: log when the detailed precision flag changes to help detect E2E flakiness
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.info(
        "Home: useDetailedAnnualEstimate",
        settings.useDetailedAnnualEstimate
      );
    }
  }, [settings.useDetailedAnnualEstimate]);

  // Debug the full settings object when it changes to verify area prop syncing
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.info("Home: full settings snapshot", settings);
    }
  }, [settings]);

  const annualEstimate = useMemo(() => {
    const useManualHeatLoss = Boolean(settings?.useManualHeatLoss);
    const useCalculatedHeatLoss = settings?.useCalculatedHeatLoss !== false; // Default to true
    const useAnalyzerHeatLoss = Boolean(settings?.useAnalyzerHeatLoss);
    let heatLossFactor;
    
    // Priority 1: Manual Entry (if enabled)
    if (useManualHeatLoss) {
      const manualHeatLossFactor = Number(settings?.manualHeatLoss);
      if (Number.isFinite(manualHeatLossFactor) && manualHeatLossFactor > 0) {
        // manualHeatLoss is already stored as BTU/hr/°F (heat loss factor)
        heatLossFactor = manualHeatLossFactor;
      }
    }
    
    // Priority 2: Analyzer Data from CSV (if enabled and available)
    if (!heatLossFactor && useAnalyzerHeatLoss && latestAnalysis?.heatLossFactor) {
      heatLossFactor = latestAnalysis.heatLossFactor;
    }
    
    // Priority 3: Calculated from Building Characteristics (DoE data)
    if (!heatLossFactor && useCalculatedHeatLoss) {
      const BASE_BTU_PER_SQFT_HEATING = 22.67;
      const ceilingMultiplier = 1 + ((settings.ceilingHeight || 8) - 8) * 0.1;
      const designHeatLoss =
        (settings.squareFeet || 1500) *
        BASE_BTU_PER_SQFT_HEATING *
        (settings.insulationLevel || 1.0) *
        (settings.homeShape || 1.0) *
        ceilingMultiplier;
      heatLossFactor = designHeatLoss / 70;
    }
    
    // Fallback: Use analyzer data if available (for backwards compatibility)
    if (!heatLossFactor && latestAnalysis?.heatLossFactor) {
      heatLossFactor = latestAnalysis.heatLossFactor;
    }

    if (!userLocation || !heatLossFactor) {
      return null;
    }

    const homeElevation =
      typeof globalHomeElevation === "number"
        ? globalHomeElevation
        : settings.homeElevation ?? 0;
    const elevationMultiplierRaw = 1 + ((homeElevation || 0) / 1000) * 0.005;
    const elevationMultiplier = Math.max(
      0.8,
      Math.min(1.3, elevationMultiplierRaw)
    );

    const winterThermostat = settings.winterThermostat;
    const summerThermostat = settings.summerThermostat;
    const useDetailed = settings.useDetailedAnnualEstimate;

    const annualHDD = getAnnualHDD(
      `${userLocation.city}, ${userLocation.state}`,
      userLocation.state
    );
    const heatingThermostatMultiplier = (winterThermostat || 70) / 70;

    const useElectricAuxHeat = settings.useElectricAuxHeat;
    const annualHeatingCost = calculateAnnualHeatingCostFromHDD(
      annualHDD,
      heatLossFactor,
      settings.hspf2 || 9.0,
      settings.utilityCost || 0.15,
      useElectricAuxHeat
    );
    annualHeatingCost.energy *= heatingThermostatMultiplier;
    annualHeatingCost.cost *= heatingThermostatMultiplier;
    annualHeatingCost.energy *= elevationMultiplier;
    annualHeatingCost.cost *= elevationMultiplier;

    const annualCDD = getAnnualCDD(
      `${userLocation.city}, ${userLocation.state}`,
      userLocation.state
    );
    const BASE_BTU_PER_SQFT_COOLING = 28.0;
    const ceilingMultiplier = 1 + ((settings.ceilingHeight || 8) - 8) * 0.1;
    const designHeatGain =
      (settings.squareFeet || 1500) *
      BASE_BTU_PER_SQFT_COOLING *
      (settings.insulationLevel || 1.0) *
      (settings.homeShape || 1.0) *
      ceilingMultiplier *
      (settings.solarExposure || 1.0);
    const heatGainFactor = designHeatGain / 20;

    const coolingThermostatMultiplier = 74 / (summerThermostat || 74);

    const annualCoolingCost = calculateAnnualCoolingCostFromCDD(
      annualCDD,
      heatGainFactor,
      settings.efficiency || 15.0,
      settings.utilityCost || 0.15
    );
    annualCoolingCost.energy *= coolingThermostatMultiplier;
    annualCoolingCost.cost *= coolingThermostatMultiplier;
    annualCoolingCost.energy *= elevationMultiplier;
    annualCoolingCost.cost *= elevationMultiplier;

    const totalAnnualCost = annualHeatingCost.cost + annualCoolingCost.cost;

    const quickEstimate = {
      totalCost: totalAnnualCost,
      elevationDelta: elevationMultiplier,
      homeElevation: homeElevation,
      heatingCost: annualHeatingCost.cost,
      coolingCost: annualCoolingCost.cost,
      auxKwhIncluded: annualHeatingCost.auxKwhIncluded || 0,
      auxKwhExcluded: annualHeatingCost.auxKwhExcluded || 0,
      hdd: annualHDD,
      cdd: annualCDD,
      isEstimated: !latestAnalysis?.heatLossFactor,
      method: useDetailed ? "detailed" : "quick",
      winterThermostat: winterThermostat,
      summerThermostat: summerThermostat,
    };

    if (useDetailed && precisionEstimate) {
      return {
        ...quickEstimate,
        totalCost: precisionEstimate.totalCost,
        heatingCost: precisionEstimate.heatingCost,
        coolingCost: precisionEstimate.coolingCost,
        totalEnergy: precisionEstimate.totalEnergy,
        totalAux: precisionEstimate.totalAux,
        method: "fullPrecision",
      };
    }

    return quickEstimate;
  }, [
    latestAnalysis,
    userLocation,
    // --- FIX: ADD ALL SETTINGS FROM CONTEXT TO THE DEPENDENCY ARRAY ---
    settings.squareFeet,
    settings.insulationLevel,
    settings.homeShape,
    settings.ceilingHeight,
    settings.utilityCost,
    settings.homeElevation,
    settings.hspf2,
    settings.efficiency,
    settings.solarExposure,
    settings.useElectricAuxHeat,
    settings.winterThermostat,
    settings.summerThermostat,
    settings.useDetailedAnnualEstimate,
    settings.useManualHeatLoss,
    settings.useCalculatedHeatLoss,
    settings.useAnalyzerHeatLoss,
    settings.manualHeatLoss,
    precisionEstimate,
    globalHomeElevation, // Also add the global elevation
  ]);

  React.useEffect(() => {
    let mounted = true;
    async function runPrecision() {
      if (!settings.useDetailedAnnualEstimate || !userLocation) {
        setPrecisionEstimate(null);
        return;
      }
      try {
        setPrecisionLoading(true);
        setPrecisionError(null);
        const res = await computeAnnualPrecisionEstimate(settings, {
          monthlyProfile: optionsMonthlyProfileFromUserLocation(userLocation),
        });
        if (mounted) {
          setPrecisionEstimate(res);
        }
      } catch (error) {
        console.warn("computeAnnualPrecisionEstimate failed", error);
        if (mounted) setPrecisionError("Failed to compute detailed estimate.");
      } finally {
        if (mounted) setPrecisionLoading(false);
      }
    }
    runPrecision();
    return () => {
      mounted = false;
    };
  }, [
    settings,
    settings.useDetailedAnnualEstimate,
    userLocation,
    settings.winterThermostat,
    settings.summerThermostat,
    settings.squareFeet,
    settings.insulationLevel,
    settings.homeShape,
    settings.ceilingHeight,
    settings.hspf2,
    settings.efficiency,
    settings.utilityCost,
    settings.useElectricAuxHeat,
  ]);

  function optionsMonthlyProfileFromUserLocation() {
    const defaultHighs = [42, 45, 55, 65, 75, 85, 88, 86, 78, 66, 55, 45];
    return defaultHighs.map((h) => ({ high: h, low: h - 14 }));
  }

  return (
    <>
      <div className="page-gradient-overlay min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Header with Icon */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-3">
            <div className="icon-container icon-container-gradient">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="heading-primary">
                Mission Control
              </h1>
              <p className="text-muted mt-1">
                Real-time system monitoring and optimization
              </p>
            </div>
          </div>
        </div>

      {/* Demo Mode Banner */}
      {isDemo && !bannerDismissed && (
        <DemoModeBanner
          onDismiss={() => {
            setBannerDismissed(true);
            try {
              localStorage.setItem('demoBannerDismissed', 'true');
            } catch {}
          }}
        />
      )}

      {/* Ask Joule (Home Shortcut) */}
      <div className="mb-6">
        <AskJoule
          hasLocation={!!userLocation}
          userSettings={userSettings}
          userLocation={userLocation}
          onParsed={(data) => {
            // For now just log; future: map command actions to context updates or navigation.
            try {
              console.info("AskJoule(Home) parsed:", data);
            } catch {
              /* ignore */
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-6">
        {/* Live Status Hero */}
        <div className="glass-card-gradient glass-card p-glass-lg animate-scale-in mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="icon-container icon-container-gradient">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-high-contrast">System Status</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemStatus === "HEAT ON" ? "bg-orange-500 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm font-semibold text-high-contrast">{systemStatus}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Temperature */}
            <div className="text-center">
              <div className="text-6xl font-black text-high-contrast mb-2">
                {currentTemp.toFixed(1)}°F
              </div>
              <div className="text-sm text-muted">Indoor Temperature</div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Fan className={`w-5 h-5 ${systemStatus === "HEAT ON" ? "text-orange-500 animate-spin" : "text-gray-400"}`} />
                <span className="text-xs text-muted">HVAC Active</span>
              </div>
            </div>

            {/* Sparkline Graph */}
            <div className="md:col-span-2">
              <div className="text-sm font-semibold text-high-contrast mb-2">Temperature Trend (4 hours)</div>
              <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                  <polyline
                    points={sparklineData.map((temp, i) => `${(i / (sparklineData.length - 1)) * 200},${80 - ((temp - 68) / 8) * 80}`).join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-500"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-glass mb-6">
          {/* Event Log */}
          <div className="lg:col-span-2 glass-card p-glass animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="heading-tertiary">
                Active Intelligence Feed
              </h3>
            </div>
            <div 
              ref={eventLogRef}
              className="bg-slate-900 dark:bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm space-y-2"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 transparent'
              }}
            >
              {eventLog.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 text-green-400">
                  <span className="text-green-600 dark:text-green-800 flex-shrink-0">{event.time}</span>
                  <span className={`${
                    event.type === "success" ? "text-green-400" :
                    event.type === "warning" ? "text-yellow-400" :
                    "text-blue-400"
                  }`}>
                    {event.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimize Now Button & Hardware Status */}
          <div className="space-y-4">
            {/* Optimize Now Button */}
            <div className="glass-card p-glass animate-fade-in-up">
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Optimize Now</span>
                  </>
                )}
              </button>
              <p className="text-xs text-muted mt-2 text-center">
                One-click system optimization
              </p>
            </div>

            {/* Hardware Link Simulator */}
            <div className="glass-card p-glass animate-fade-in-up">
              <h3 className="heading-tertiary mb-4">Hardware Status</h3>
              <div className="space-y-3">
                {/* ProStat Bridge */}
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-violet-500" />
                    <div>
                      <div className="font-semibold text-high-contrast">ProStat Bridge</div>
                      <div className="text-xs text-muted">Raspberry Pi Zero 2 W</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>

                {/* Ecobee Thermostat */}
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6 text-blue-500" />
                    <div>
                      <div className="font-semibold text-high-contrast">Ecobee Thermostat</div>
                      <div className="text-xs text-muted">HomeKit Integration</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">Paired</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legacy: At a glance (Hidden by default, can be shown via toggle) */}
        <div className="glass-card p-glass animate-fade-in-up hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="heading-tertiary">
              At a glance
            </h3>
          </div>
            {lastForecast ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Last forecast in
                    </p>
                    <p
                      data-testid="last-forecast-elevation"
                      className="text-xl font-bold text-gray-900 dark:text-white"
                    >
                      {(() => {
                        if (!lastForecast || !userLocation)
                          return lastForecast?.location || "";
                        const city =
                          userLocation.city ||
                          lastForecast.location?.split(",")[0] ||
                          "";
                        const state = userLocation.state || "";
                        const elevation =
                          typeof globalHomeElevation === "number"
                            ? globalHomeElevation
                            : userLocation.elevation ?? 0;
                        return `${city}, ${state} (Elev: ${elevation} ft)`;
                      })()}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-glass-sm">
                    <div className="text-center glass-card p-glass-sm">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Zap className="w-3 h-3 text-blue-500" />
                        <div className="text-[11px] font-semibold text-muted">
                          Heat Pump (7d)
                        </div>
                      </div>
                      <div className="text-xl font-bold text-high-contrast">
                        {currency(lastForecast.totalHPCost)}
                      </div>
                    </div>
                    <div className="text-center glass-card p-glass-sm">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <div className="text-[11px] font-semibold text-muted">
                          Gas (7d)
                        </div>
                      </div>
                      {lastForecast.totalGasCost > 0 ? (
                        <div className="text-xl font-bold text-high-contrast">
                          {currency(lastForecast.totalGasCost)}
                        </div>
                      ) : (
                        <div className="text-sm text-subtle">
                          <Link
                            to="/cost-comparison"
                            className="underline hover:text-high-contrast"
                          >
                            Run a comparison
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="text-center glass-card p-glass-sm">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <div className="text-[11px] font-semibold text-muted">
                          Savings (7d)
                        </div>
                      </div>
                      {lastForecast.totalSavings > 0 ? (
                        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {currency(lastForecast.totalSavings)}
                        </div>
                      ) : (
                        <div className="text-sm text-subtle">
                          <Link
                            to="/cost-comparison"
                            className="underline hover:text-high-contrast"
                          >
                            Run a comparison
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted">
                Run a forecast or comparison to see a summary here.
              </p>
            )}
            <div className="mt-4">
              <Link
                to="/cost-comparison"
                className="btn-glass inline-flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Open System Comparison
              </Link>
            </div>
          </div>

          {/* Annual Estimate (Collapsible Report Section) */}
          <details className="glass-card p-glass animate-fade-in-up">
            <summary className="cursor-pointer flex items-center gap-3 mb-4">
              <div className="icon-container">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="heading-tertiary">
                Annual Energy Cost Estimate (Report)
              </h3>
            </summary>
            <div className="mt-4">
              <div
                data-testid="annual-cost-card"
                className="glass-card-gradient glass-card p-glass-lg text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="icon-container icon-container-gradient">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-lg font-semibold text-high-contrast flex items-center justify-center gap-2">
                    Annual Energy Cost Est.
                    <span
                      data-testid="estimation-method"
                      className="ml-2 text-xs font-semibold text-purple-600 dark:text-purple-300"
                    >
                      {annualEstimate?.method === "fullPrecision"
                        ? "Full Precision"
                        : annualEstimate?.method === "detailed"
                        ? "Detailed"
                        : "Quick"}
                    </span>
                    {annualEstimate?.isEstimated && (
                      <span
                        title={`Based on ${annualEstimate?.hdd?.toLocaleString()} HDD & ${annualEstimate?.cdd?.toLocaleString()} CDD/year (estimated). Upload thermostat data for personalized accuracy.`}
                      >
                        <Info size={16} className="text-purple-400" />
                      </span>
                    )}
                  </div>
                </div>
                <div
                  data-testid="annual-total-cost"
                  className="text-4xl sm:text-5xl font-black text-high-contrast mb-3"
                >
                  {annualEstimate ? currency(annualEstimate.totalCost) : "—"}
                </div>
                {precisionLoading && (
                  <div
                    data-testid="annual-precision-loading"
                    className="mt-2 text-sm text-gray-600"
                  >
                    Calculating detailed estimate…
                  </div>
                )}
                {precisionError && (
                  <div
                    data-testid="annual-precision-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {precisionError}
                  </div>
                )}
                {annualEstimate && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted mb-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>
                        Heating:{" "}
                        <strong data-testid="annual-heating-cost" className="text-high-contrast">
                          {currency(annualEstimate.heatingCost)}
                        </strong>
                      </span>
                    </div>
                    <span className="hidden sm:inline text-subtle">·</span>
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4 text-blue-500" />
                      <span>
                        Cooling:{" "}
                        <strong data-testid="annual-cooling-cost" className="text-high-contrast">
                          {currency(annualEstimate.coolingCost)}
                        </strong>
                      </span>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <Link
                    to="/cost-forecaster"
                    className="btn-gradient inline-flex items-center gap-2"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Set My Thermostats in 7-Day Forecast
                  </Link>
                </div>
                {annualEstimate?.auxKwhExcluded > 0 && (
                  <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-2 text-xs text-yellow-800 dark:text-yellow-200">
                    <p id="aux-excluded-note">
                      Note: {annualEstimate.auxKwhExcluded.toFixed(0)} kWh of electric
                      aux heat was excluded from this estimate because your settings
                      indicate that electric auxiliary heat is not used.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </details>

          {/* Unlock Personalized Accuracy CTA */}
          <div className="glass-card p-glass animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="icon-container">
                {latestAnalysis ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                {latestAnalysis ? (
                  <>
                    <h3 className="heading-tertiary mb-1">
                      Forecasts are Personalized
                    </h3>
                    <p className="text-high-contrast text-lg font-bold">
                      Thermal Factor: {latestAnalysis.heatLossFactor?.toFixed(1)}{" "}
                      BTU/hr/°F
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Your real-world factor is being used everywhere.
                    </p>
                    <Link
                      to="/performance-analyzer"
                      className="btn-gradient inline-flex items-center gap-2 mt-3"
                    >
                      <Activity className="w-4 h-4" />
                      View My Analysis
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="heading-tertiary mb-1">
                      Unlock Personalized Accuracy
                    </h3>
                    <p className="text-xs text-muted">
                      Your estimates are currently based on general models. Upload
                      your thermostat data for real-world accuracy.
                    </p>
                    <Link
                      to="/performance-analyzer"
                      className="btn-gradient inline-flex items-center gap-2 mt-3"
                    >
                      <Activity className="w-4 h-4" />
                      Analyze My System
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Building Heat Loss (Manual Estimator) - Full Width */}
        <div className="glass-card p-glass fade-in animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <Link
              to="/performance-analyzer"
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="heading-secondary flex items-center gap-3">
                <div className="icon-container">
                  <Home className="w-5 h-5 text-blue-500" />
                </div>
                Building Heat Loss
              </h2>
              {/* Show current Thermal Factor if available */}
              <span className="inline-flex items-center gap-1 text-base font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded px-2 py-0.5">
                {latestAnalysis?.heatLossFactor ? (
                  <>
                    {latestAnalysis.heatLossFactor.toFixed(1)}{" "}
                    <span className="text-xs font-normal">BTU/hr/°F</span>
                    <button
                      type="button"
                      className="ml-1 text-blue-400 hover:text-blue-700 dark:hover:text-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowHeatLossTooltip((t) => !t);
                      }}
                      aria-label="What is the Thermal Factor?"
                    >
                      <Info size={16} />
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    (not set)
                  </span>
                )}
              </span>
              {showHeatLossTooltip && (
                <div className="absolute z-50 mt-10 md:mt-0 md:ml-64 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-lg shadow-lg p-4 text-xs text-gray-700 dark:text-gray-200 w-72">
                  <strong>Thermal Factor</strong> (BTU/hr/°F) is your building's
                  heat loss per degree of temperature difference. Lower is
                  better. This value is used to estimate heating needs and
                  system sizing. You can refine it by uploading thermostat data
                  or using the manual estimator below.
                  <br />
                  <Link
                    to="/performance-analyzer"
                    className="text-blue-600 underline block mt-2"
                  >
                    Learn more in Performance Analyzer →
                  </Link>
                </div>
              )}
            </Link>
            <button
              className="text-blue-600 dark:text-blue-400 text-sm underline ml-2 md:ml-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowBuildingHeatLoss((v) => !v);
              }}
            >
              {showBuildingHeatLoss ? "Hide" : "Show"}
            </button>
          </div>
          {showBuildingHeatLoss && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Square Footage
                  </label>
                  <input
                    type="range"
                    min="800"
                    max="4000"
                    step="100"
                    value={squareFeetLocal}
                    onChange={(e) => setSquareFeetLocal(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {squareFeetLocal.toLocaleString()} sq ft
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ceiling Height
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="20"
                    step="1"
                    value={ceilingHeightLocal}
                    onChange={(e) =>
                      setCeilingHeightLocal(Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {ceilingHeightLocal} ft
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Insulation
                  </label>
                  <select
                    value={insulationLevelLocal}
                    onChange={(e) =>
                      setInsulationLevelLocal(Number(e.target.value))
                    }
                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    <option value={1.4}>Poor</option>
                    <option value={1.0}>Average</option>
                    <option value={0.65}>Good</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Home Shape
                  </label>
                  <select
                    value={homeShapeLocal}
                    onChange={(e) => setHomeShapeLocal(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    <option value={1.3}>Cabin / A-Frame</option>
                    <option value={1.15}>Ranch</option>
                    <option value={1.0}>Average</option>
                    <option value={0.9}>2-Story</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 space-y-2">
                {(() => {
                  const manualHeatLoss = Math.round(
                    squareFeetLocal *
                      ceilingHeightLocal *
                      insulationLevelLocal *
                      homeShapeLocal
                  );
                  return (
                    <>
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        <p>
                          <strong>Calculated Heat Loss:</strong>{" "}
                          {manualHeatLoss.toLocaleString()} BTU/hr at 70°F ΔT (
                          {(manualHeatLoss / 70).toFixed(1)} BTU/hr/°F)
                        </p>
                        <div className="flex items-start gap-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This is an estimate — real-world dynamic effects
                            like solar gains, infiltration, or internal heat
                            loads can change results.
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setShowHeatLossTooltip(!showHeatLossTooltip)
                            }
                            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors mt-1"
                            aria-label="More about dynamic effects"
                          >
                            <Info size={14} />
                          </button>
                        </div>
                        {showHeatLossTooltip && (
                          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-xs text-gray-700 dark:text-gray-300">
                            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                              Why this is an estimate
                            </p>
                            <ul className="ml-4 list-disc space-y-1">
                              <li>
                                <strong>Solar gains:</strong> Sunlight through
                                windows and glazing can reduce heating demand
                                during the day.
                              </li>
                              <li>
                                <strong>Infiltration:</strong> Air leakage
                                (drafts) introduces additional heating load,
                                especially in cold/windy conditions.
                              </li>
                              <li>
                                <strong>Internal loads:</strong> Occupancy,
                                appliances, and lighting add heat that affects
                                the net load.
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        <strong>What does this mean?</strong> We report heat
                        loss at a standardized ΔT of 70°F—that's the difference
                        between an indoor setpoint of 70°F and an outdoor design
                        temperature of 0°F. Using a fixed ΔT is a common
                        engineering practice because it makes heat-loss numbers
                        comparable between homes and useful for sizing a heating
                        system.
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>More detail:</strong> The value in BTU/hr is the
                        building's heat loss at that ΔT; dividing by 70 gives
                        BTU/hr/°F so you can multiply by any real-world
                        indoor–outdoor temperature difference to estimate hourly
                        heat loss (e.g., at 50°F ΔT, Heat Loss ≈ BTU/hr/°F ×
                        50).
                      </p>
                      <div className="flex gap-3 mt-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            if (setHeatLossFactor)
                              setHeatLossFactor(manualHeatLoss / 70);
                          }}
                        >
                          Use this Data
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            setSquareFeetLocal(settings.squareFeet || 1500);
                            setCeilingHeightLocal(settings.ceilingHeight || 8);
                            setInsulationLevelLocal(
                              settings.insulationLevel || 1.0
                            );
                            setHomeShapeLocal(settings.homeShape || 1.0);
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </div>

        {/* Edit Home Details Button */}
        <div className="flex justify-end">
          <button
            className="btn btn-primary px-6 py-2 text-sm font-semibold"
            onClick={() => {
              try {
                localStorage.removeItem("hasCompletedOnboarding");
              } catch {
                // Ignore localStorage errors
              }
              window.location.href = "/cost-forecaster";
            }}
          >
            Edit Home Details
          </button>
        </div>

        {/* Tool Launcher Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Tools & Calculators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/cost-forecaster"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                <Calendar size={18} className="text-emerald-600" /> 7-Day Cost
                Forecaster
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Estimate weekly heating or cooling costs.
              </p>
            </Link>
            <Link
              to="/cost-comparison"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                <TrendingUp size={18} className="text-blue-600" /> System
                Comparison
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Compare heat pump vs. gas furnace economics.
              </p>
            </Link>
            <Link
              to="/energy-flow"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-cyan-400 dark:hover:border-cyan-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                <Activity size={18} className="text-cyan-600" /> Balance Point
                Analyzer
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Visualize performance and balance point.
              </p>
            </Link>
            <Link
              to="/charging-calculator"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-yellow-400 dark:hover:border-yellow-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                <Zap size={18} className="text-yellow-600" /> A/C Charging
                Calculator
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Charge using subcooling.
              </p>
            </Link>
            <Link
              to="/performance-analyzer"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-violet-400 dark:hover:border-violet-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                <BarChart3 size={18} className="text-violet-600" /> Performance
                Analyzer
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Compute your building's thermal factor.
              </p>
            </Link>
            <Link
              to="/methodology"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                <Info size={18} className="text-gray-600" /> Calculation
                Methodology
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                How the math works.
              </p>
            </Link>
            <Link
              to="/settings"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                <SettingsIcon size={18} className="text-slate-600" /> Settings
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Adjust preferences, rates, and personalization.
              </p>
            </Link>
            <Link
              to="/thermostat-analyzer"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                🔍 Thermostat Strategy Analyzer
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Compare constant temp vs. nightly setback to see the cost
                impact.
              </p>
            </Link>
            <Link
              to="/monthly-budget"
              className="group border dark:border-gray-700 rounded-lg p-4 hover:border-pink-400 dark:hover:border-pink-600 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                💸 Monthly Budget Planner
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Plan your monthly energy budget and track costs.
              </p>
            </Link>
          </div>
        </div>
        </div>
        </div>

      {/* Optimization Modal */}
      {showOptimizeModal && optimizationResults && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-high-contrast">Optimization Complete</h3>
              <button
                onClick={() => {
                  setShowOptimizeModal(false);
                  setOptimizationResults(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    Found {optimizationResults.inefficiencies} inefficiencies
                  </span>
                </div>
                <div className="text-3xl font-black text-green-600 dark:text-green-400">
                  Saved ${optimizationResults.savings}/year
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold text-high-contrast">Recommended Fixes:</p>
                <ul className="space-y-2">
                  {optimizationResults.fixes.map((fix, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOptimizeModal(false);
                  setOptimizationResults(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Review Later
              </button>
              <button
                onClick={() => {
                  setShowOptimizeModal(false);
                  setOptimizationResults(null);
                  // In real app, this would apply the fixes
                  setEventLog((prev) => [
                    { 
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                      message: `Applied ${optimizationResults.inefficiencies} optimizations. Estimated savings: $${optimizationResults.savings}/year.`, 
                      type: "success" 
                    },
                    ...prev,
                  ]);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                Apply Fixes
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-muted mb-3">
                Want this for real?
              </p>
              <button
                onClick={() => {
                  navigate("/upgrades?product=core&showCart=true");
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
              >
                Buy the Bridge ($299)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeDashboard;
