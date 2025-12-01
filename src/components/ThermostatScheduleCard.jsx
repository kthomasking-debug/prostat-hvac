// src/components/ThermostatScheduleCard.jsx
// Extracted from SevenDayCostForecaster - Dual-period thermostat schedule UI
// Controlled component - receives state from parent for cost calculations

import React, { useCallback, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import ThermostatClock, { getCurrentPeriod } from "./ThermostatClock";
import {
  loadThermostatSettings,
  saveThermostatSettings,
} from "../lib/thermostatSettings";
import { setSetting } from "../lib/unifiedSettingsManager";

/**
 * Convert time string to minutes since midnight
 * @param {string} time - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * 24-Hour Timeline Preview Component
 * Shows day/night periods visually with current time indicator
 */
function TimelinePreview({ daytimeTime, nighttimeTime }) {
  const dayMins = timeToMinutes(daytimeTime);
  const nightMins = timeToMinutes(nighttimeTime);
  const totalMins = 24 * 60;

  const renderPeriods = () => {
    if (dayMins < nightMins) {
      // Normal case: day before night
      const dayWidth = ((nightMins - dayMins) / totalMins) * 100;
      const dayStart = (dayMins / totalMins) * 100;

      return (
        <>
          {/* Night period (before day) */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600"
            style={{ left: 0, width: `${dayStart}%` }}
          />
          {/* Day period */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600"
            style={{ left: `${dayStart}%`, width: `${dayWidth}%` }}
          />
          {/* Night period (after day) */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
            style={{
              left: `${dayStart + dayWidth}%`,
              width: `${100 - dayStart - dayWidth}%`,
            }}
          />
        </>
      );
    } else {
      // Wrapped case: night before day
      const nightWidth = ((dayMins - nightMins) / totalMins) * 100;
      const nightStart = (nightMins / totalMins) * 100;

      return (
        <>
          {/* Day period (before night) */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600"
            style={{ left: 0, width: `${nightStart}%` }}
          />
          {/* Night period */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
            style={{ left: `${nightStart}%`, width: `${nightWidth}%` }}
          />
          {/* Day period (after night) */}
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500"
            style={{
              left: `${nightStart + nightWidth}%`,
              width: `${100 - nightStart - nightWidth}%`,
            }}
          />
        </>
      );
    }
  };

  const renderCurrentTimeIndicator = () => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const nowPercent = (nowMins / (24 * 60)) * 100;

    return (
      <div
        className="absolute top-0 h-full w-0.5 bg-red-500 shadow-lg z-10"
        style={{ left: `${nowPercent}%` }}
        title={`Current time: ${now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}`}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
      </div>
    );
  };

  return (
    <div className="mb-6 px-2">
      <div className="relative h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        {renderPeriods()}
        {renderCurrentTimeIndicator()}
        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-600 dark:text-gray-400 px-1">
          <span>12a</span>
          <span>6a</span>
          <span>12p</span>
          <span>6p</span>
          <span>12a</span>
        </div>
      </div>
    </div>
  );
}

/**
 * ThermostatScheduleCard Component
 * Dual-period schedule with day/night clocks and timeline preview
 * Controlled component - state is managed by parent for cost calculations
 *
 * @param {number} indoorTemp - Current daytime temperature setting
 * @param {string} daytimeTime - Daytime period start time (HH:MM)
 * @param {string} nighttimeTime - Nighttime period start time (HH:MM)
 * @param {number} nighttimeTemp - Nighttime temperature setting
 * @param {Function} onDaytimeTimeChange - Callback when daytime time changes
 * @param {Function} onNighttimeTimeChange - Callback when nighttime time changes
 * @param {Function} onNighttimeTempChange - Callback when nighttime temp changes
 * @param {Function} onIndoorTempChange - Callback when daytime temp changes
 * @param {Function} setUserSetting - User settings setter from outlet context
 * @param {string} daytimeSettingKey - Optional: Setting key for daytime temp (default: "winterThermostat")
 * @param {boolean} skipComfortSettingsUpdate - Optional: Skip updating comfort settings (for Annual Budget Planner)
 */
export default function ThermostatScheduleCard({
  indoorTemp,
  daytimeTime,
  nighttimeTime,
  nighttimeTemp,
  onDaytimeTimeChange,
  onNighttimeTimeChange,
  onNighttimeTempChange,
  onIndoorTempChange,
  setUserSetting,
  daytimeSettingKey = "winterThermostat",
  skipComfortSettingsUpdate = false,
}) {
  // Track which period is currently active (updates every minute)
  const [activePeriod, setActivePeriod] = useState(() =>
    getCurrentPeriod(daytimeTime, nighttimeTime)
  );

  // Update active period when times change or every minute
  useEffect(() => {
    setActivePeriod(getCurrentPeriod(daytimeTime, nighttimeTime));

    const interval = setInterval(() => {
      setActivePeriod(getCurrentPeriod(daytimeTime, nighttimeTime));
    }, 60000);

    return () => clearInterval(interval);
  }, [daytimeTime, nighttimeTime]);

  // Handle daytime temperature change
  const handleDaytimeTempChange = useCallback(
    (temp) => {
      if (!skipComfortSettingsUpdate) {
        setSetting(daytimeSettingKey, temp, {
          source: "ThermostatScheduleCard",
          comment: "Set daytime temperature via clock control",
        });
        if (setUserSetting) {
          setUserSetting(daytimeSettingKey, temp, {
            source: "ThermostatScheduleCard",
            comment: "Set daytime temperature via clock control",
          });
        }
      }
      onIndoorTempChange?.(temp);
    },
    [setUserSetting, onIndoorTempChange, daytimeSettingKey, skipComfortSettingsUpdate]
  );

  // Handle daytime time change
  const handleDaytimeTimeChange = useCallback((time) => {
    onDaytimeTimeChange?.(time);

    try {
      const thermostatSettings = loadThermostatSettings();
      for (let day = 0; day < 7; day++) {
        const daySchedule = thermostatSettings.schedule.weekly[day] || [];

        const homeIndex = daySchedule.findIndex(
          (entry) => entry.comfortSetting === "home"
        );
        if (homeIndex >= 0) {
          daySchedule[homeIndex].time = time;
        } else {
          daySchedule.push({ time, comfortSetting: "home" });
          daySchedule.sort((a, b) => a.time.localeCompare(b.time));
        }

        thermostatSettings.schedule.weekly[day] = daySchedule;
      }
      saveThermostatSettings(thermostatSettings);
      window.dispatchEvent(
        new CustomEvent("thermostatSettingsUpdated", {
          detail: { schedule: thermostatSettings.schedule },
        })
      );
    } catch (error) {
      console.error("Failed to update daytime start:", error);
    }
  }, [onDaytimeTimeChange]);

  // Handle nighttime temperature change
  const handleNighttimeTempChange = useCallback((temp) => {
    onNighttimeTempChange?.(temp);
    if (!skipComfortSettingsUpdate) {
      try {
        const thermostatSettings = loadThermostatSettings();
        if (!thermostatSettings.comfortSettings) {
          thermostatSettings.comfortSettings = {};
        }
        if (!thermostatSettings.comfortSettings.sleep) {
          thermostatSettings.comfortSettings.sleep = {
            heatSetPoint: temp,
            coolSetPoint: 72,
            fanMode: "auto",
            sensors: ["main"],
          };
        } else {
          thermostatSettings.comfortSettings.sleep.heatSetPoint = temp;
        }
        saveThermostatSettings(thermostatSettings);
        window.dispatchEvent(
          new CustomEvent("thermostatSettingsUpdated", {
            detail: { comfortSettings: thermostatSettings.comfortSettings },
          })
        );
      } catch (error) {
        console.error("Failed to update nighttime temperature:", error);
      }
    }
  }, [onNighttimeTempChange, skipComfortSettingsUpdate]);

  // Handle nighttime time change
  const handleNighttimeTimeChange = useCallback((time) => {
    onNighttimeTimeChange?.(time);

    try {
      const thermostatSettings = loadThermostatSettings();
      for (let day = 0; day < 7; day++) {
        const daySchedule = thermostatSettings.schedule.weekly[day] || [];

        const sleepIndex = daySchedule.findIndex(
          (entry) => entry.comfortSetting === "sleep"
        );
        if (sleepIndex >= 0) {
          daySchedule[sleepIndex].time = time;
        } else {
          daySchedule.push({ time, comfortSetting: "sleep" });
          daySchedule.sort((a, b) => a.time.localeCompare(b.time));
        }

        thermostatSettings.schedule.weekly[day] = daySchedule;
      }
      saveThermostatSettings(thermostatSettings);
      window.dispatchEvent(
        new CustomEvent("thermostatSettingsUpdated", {
          detail: { schedule: thermostatSettings.schedule },
        })
      );
    } catch (error) {
      console.error("Failed to update nighttime start:", error);
    }
  }, [onNighttimeTimeChange]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Thermostat Schedule
          </h3>
        </div>
        <div className="text-xs text-muted">
          Set when each period <em>begins</em> — the system switches
          automatically
        </div>
      </div>

      <TimelinePreview
        daytimeTime={daytimeTime}
        nighttimeTime={nighttimeTime}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Daytime Clock */}
        <ThermostatClock
          mode="day"
          temperature={indoorTemp}
          time={daytimeTime}
          isActive={activePeriod === "day"}
          otherTime={nighttimeTime}
          onTemperatureChange={handleDaytimeTempChange}
          onTimeChange={handleDaytimeTimeChange}
        />

        {/* Nighttime Clock */}
        <ThermostatClock
          mode="night"
          temperature={nighttimeTemp}
          time={nighttimeTime}
          isActive={activePeriod === "night"}
          otherTime={daytimeTime}
          onTemperatureChange={handleNighttimeTempChange}
          onTimeChange={handleNighttimeTimeChange}
        />
      </div>
    </div>
  );
}

