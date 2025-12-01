import React, { useState, useEffect } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import {
  loadThermostatSettings,
  saveThermostatSettings,
} from "../lib/thermostatSettings";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_KEYS = [0, 1, 2, 3, 4, 5, 6];
const COMFORT_SETTINGS = ["home", "away", "sleep"];

// Helper function to apply a profile to settings
const applyProfile = (settings, profile) => {
  const updated = { ...settings };
  if (!updated.comfortSettings) {
    updated.comfortSettings = {};
  }
  if (!updated.schedule) {
    updated.schedule = { enabled: true, weekly: {} };
  }
  if (!updated.schedule.weekly) {
    updated.schedule.weekly = {};
  }

  // Initialize comfort settings if needed
  if (!updated.comfortSettings.home) {
    updated.comfortSettings.home = {
      heatSetPoint: 70,
      coolSetPoint: 74,
      humiditySetPoint: 50,
      fanMode: "auto",
      sensors: ["main"],
    };
  }
  if (!updated.comfortSettings.away) {
    updated.comfortSettings.away = {
      heatSetPoint: 62,
      coolSetPoint: 85,
      humiditySetPoint: 60,
      fanMode: "auto",
      sensors: ["main"],
    };
  }
  if (!updated.comfortSettings.sleep) {
    updated.comfortSettings.sleep = {
      heatSetPoint: 66,
      coolSetPoint: 72,
      humiditySetPoint: 50,
      fanMode: "auto",
      sensors: ["main"],
    };
  }

  // Apply profile-specific settings
  if (profile === "workFromHome") {
    // Work from Home: Constant comfort, 24/7 occupancy
    updated.comfortSettings.home.heatSetPoint = 70;
    updated.comfortSettings.home.coolSetPoint = 74;
    updated.comfortSettings.sleep.heatSetPoint = 68;
    updated.comfortSettings.sleep.coolSetPoint = 72;
    
    // Schedule: All days same - home during day, sleep at night
    const weekdaySchedule = [
      { time: "06:00", comfortSetting: "home" },
      { time: "22:00", comfortSetting: "sleep" },
    ];
    const weekendSchedule = [
      { time: "08:00", comfortSetting: "home" },
      { time: "22:00", comfortSetting: "sleep" },
    ];
    
    // Monday-Friday (1-5)
    for (let day = 1; day <= 5; day++) {
      updated.schedule.weekly[day] = weekdaySchedule;
    }
    // Saturday (6) and Sunday (0)
    updated.schedule.weekly[6] = weekendSchedule;
    updated.schedule.weekly[0] = weekendSchedule;

  } else if (profile === "commuter") {
    // Commuter: Classic setback for work days
    updated.comfortSettings.home.heatSetPoint = 70;
    updated.comfortSettings.home.coolSetPoint = 74;
    updated.comfortSettings.away.heatSetPoint = 62;
    updated.comfortSettings.away.coolSetPoint = 85;
    updated.comfortSettings.sleep.heatSetPoint = 65;
    updated.comfortSettings.sleep.coolSetPoint = 72;
    
    // Weekday schedule: Morning (6-8am): home, Work (8am-5pm): away, Evening (5-10pm): home, Night: sleep
    const weekdaySchedule = [
      { time: "06:00", comfortSetting: "home" },
      { time: "08:00", comfortSetting: "away" },
      { time: "17:00", comfortSetting: "home" },
      { time: "22:00", comfortSetting: "sleep" },
    ];
    
    // Weekend schedule: More relaxed, home most of the day
    const weekendSchedule = [
      { time: "08:00", comfortSetting: "home" },
      { time: "22:00", comfortSetting: "sleep" },
    ];
    
    // Monday-Friday (1-5)
    for (let day = 1; day <= 5; day++) {
      updated.schedule.weekly[day] = weekdaySchedule;
    }
    // Saturday (6) and Sunday (0)
    updated.schedule.weekly[6] = weekendSchedule;
    updated.schedule.weekly[0] = weekendSchedule;

  } else if (profile === "arbitrage") {
    // Arbitrage (Peak Shaver): Pre-cool before peak, coast through expensive hours
    updated.comfortSettings.home.heatSetPoint = 68; // Pre-cool setting
    updated.comfortSettings.home.coolSetPoint = 68;
    updated.comfortSettings.away.heatSetPoint = 76; // Peak coast setting
    updated.comfortSettings.away.coolSetPoint = 76;
    updated.comfortSettings.sleep.heatSetPoint = 72;
    updated.comfortSettings.sleep.coolSetPoint = 72;
    
    // Schedule: Pre-Cool (2pm-4pm): home (68°F), Peak (4pm-8pm): away (76°F), Night: sleep (72°F)
    const weekdaySchedule = [
      { time: "06:00", comfortSetting: "home" }, // Morning comfort
      { time: "14:00", comfortSetting: "home" }, // Pre-cool starts at 2pm
      { time: "16:00", comfortSetting: "away" }, // Peak starts at 4pm (coast through)
      { time: "20:00", comfortSetting: "home" }, // Return to comfort at 8pm
      { time: "22:00", comfortSetting: "sleep" }, // Night at 10pm
    ];
    
    // Weekend: More relaxed, but still use pre-cool strategy
    const weekendSchedule = [
      { time: "08:00", comfortSetting: "home" },
      { time: "14:00", comfortSetting: "home" }, // Pre-cool
      { time: "16:00", comfortSetting: "away" }, // Peak coast
      { time: "20:00", comfortSetting: "home" },
      { time: "22:00", comfortSetting: "sleep" },
    ];
    
    // Monday-Friday (1-5)
    for (let day = 1; day <= 5; day++) {
      updated.schedule.weekly[day] = weekdaySchedule;
    }
    // Saturday (6) and Sunday (0)
    updated.schedule.weekly[6] = weekendSchedule;
    updated.schedule.weekly[0] = weekendSchedule;
  }

  // Enable schedule if not already enabled
  updated.schedule.enabled = true;
  
  // Store the selected profile
  updated.scheduleProfile = profile;

  return updated;
};

export default function ScheduleEditor() {
  const [settings, setSettings] = useState(() => {
    const loaded = loadThermostatSettings();
    // If no profile is set, apply commuter as default
    if (!loaded.scheduleProfile) {
      const withDefault = applyProfile(loaded, "commuter");
      saveThermostatSettings(withDefault);
      return withDefault;
    }
    return loaded;
  });
  const [selectedDay] = useState(null);
  
  // Ensure commuter profile is applied on mount if no profile exists
  useEffect(() => {
    const current = loadThermostatSettings();
    if (!current.scheduleProfile) {
      const withDefault = applyProfile(current, "commuter");
      saveThermostatSettings(withDefault);
      setSettings(withDefault);
    }
  }, []);

  const updateSchedule = (dayKey, schedule) => {
    const updated = { ...settings };
    updated.schedule.weekly[dayKey] = schedule;
    saveThermostatSettings(updated);
    setSettings(updated);
  };

  const addScheduleEntry = (dayKey) => {
    const daySchedule = settings.schedule.weekly[dayKey] || [];
    const newEntry = {
      time: "12:00",
      comfortSetting: "home",
    };
    const updated = [...daySchedule, newEntry].sort((a, b) =>
      a.time.localeCompare(b.time)
    );
    updateSchedule(dayKey, updated);
  };

  const removeScheduleEntry = (dayKey, index) => {
    const daySchedule = settings.schedule.weekly[dayKey] || [];
    const updated = daySchedule.filter((_, i) => i !== index);
    updateSchedule(dayKey, updated);
  };

  const updateScheduleEntry = (dayKey, index, field, value) => {
    const daySchedule = settings.schedule.weekly[dayKey] || [];
    const updated = daySchedule.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    updateSchedule(dayKey, updated);
  };

  const copyDaySchedule = (fromDay, toDay) => {
    const fromSchedule = settings.schedule.weekly[fromDay] || [];
    updateSchedule(toDay, [...fromSchedule]);
  };

  const clearDaySchedule = (dayKey) => {
    updateSchedule(dayKey, []);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Weekly Schedule
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set times when comfort settings change throughout the week
          </p>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.schedule.enabled}
            onChange={(e) => {
              const updated = { ...settings };
              updated.schedule.enabled = e.target.checked;
              saveThermostatSettings(updated);
              setSettings(updated);
            }}
            className="rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Enable Schedule
          </span>
        </label>
      </div>

      {!settings.schedule.enabled && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Schedule is disabled. Enable it to use automatic comfort setting
            changes.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAY_KEYS.map((dayKey) => {
          const daySchedule = settings.schedule.weekly[dayKey] || [];
          const isSelected = selectedDay === dayKey;

          return (
            <div
              key={dayKey}
              className={`bg-white dark:bg-gray-800 border rounded-lg p-4 ${
                isSelected
                  ? "border-blue-500 dark:border-blue-400 shadow-lg"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                  {DAYS[dayKey]}
                </h4>
                <div className="flex gap-1">
                  {dayKey > 0 && (
                    <button
                      onClick={() => copyDaySchedule(dayKey - 1, dayKey)}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Copy from previous day"
                    >
                      Copy
                    </button>
                  )}
                  <button
                    onClick={() => clearDaySchedule(dayKey)}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                    title="Clear all entries"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {daySchedule.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  No schedule entries
                </div>
              ) : (
                <div className="space-y-2">
                  {daySchedule.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
                    >
                      <div className="flex items-center gap-1 flex-1">
                        <Clock size={14} className="text-gray-400" />
                        <input
                          type="time"
                          value={entry.time}
                          onChange={(e) =>
                            updateScheduleEntry(
                              dayKey,
                              index,
                              "time",
                              e.target.value
                            )
                          }
                          className="flex-1 px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                      </div>
                      <select
                        value={entry.comfortSetting}
                        onChange={(e) =>
                          updateScheduleEntry(
                            dayKey,
                            index,
                            "comfortSetting",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 capitalize"
                      >
                        {COMFORT_SETTINGS.map((setting) => (
                          <option key={setting} value={setting}>
                            {setting}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeScheduleEntry(dayKey, index)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => addScheduleEntry(dayKey)}
                className="mt-3 w-full px-3 py-2 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                Add Entry
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> Schedule entries are automatically sorted by
          time. The comfort setting will change at each scheduled time
          throughout the day.
        </p>
      </div>

      {/* Schedule Profile Presets */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Load Schedule Preset
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Choose a preset profile based on your lifestyle and energy goals. You can customize after loading.
          </p>
        </div>
        <select
          value={settings.scheduleProfile || "commuter"}
          onChange={(e) => {
            const profile = e.target.value;
            if (!profile) return;

            const updated = applyProfile(settings, profile);
            saveThermostatSettings(updated);
            setSettings(updated);
            window.dispatchEvent(new Event("thermostatSettingsChanged"));
          }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="workFromHome">🏠 Work from Home (Constant Comfort)</option>
          <option value="commuter">🚗 Commuter (Classic Setback)</option>
          <option value="arbitrage">⚡ Arbitrage (Peak Shaver)</option>
        </select>
        
        <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <strong className="text-gray-800 dark:text-gray-200">Work from Home:</strong> Day 70°F / Night 68°F. Prioritizes comfort for 24/7 occupancy.
          </div>
          <div>
            <strong className="text-gray-800 dark:text-gray-200">Commuter:</strong> Morning 70°F → Work 62°F → Evening 70°F → Night 65°F. Saves energy while empty.
          </div>
          <div>
            <strong className="text-gray-800 dark:text-gray-200">Arbitrage:</strong> Pre-cool 68°F (2-4pm) → Peak 76°F (4-8pm) → Night 72°F. Uses house as thermal battery to avoid peak rates.
          </div>
        </div>
      </div>
    </div>
  );
}
