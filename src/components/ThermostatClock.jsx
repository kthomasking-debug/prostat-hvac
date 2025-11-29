// src/components/ThermostatClock.jsx
// Linear timeline interface for setting thermostat temperature and time
// Supports dual-period scheduling with active/inactive state indicators

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Sun, Moon, Clock, Zap } from "lucide-react";

/**
 * Convert time in HH:MM format (24-hour) to minutes since midnight
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Format duration in minutes to human-readable string
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Calculate duration between two times (in minutes)
 * Handles midnight wraparound
 */
function calculateDuration(startTime, endTime) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  if (endMinutes > startMinutes) {
    return endMinutes - startMinutes;
  } else {
    // Wraps midnight
    return (24 * 60) - startMinutes + endMinutes;
  }
}

/**
 * Determine which period is currently active
 * @param {string} daytimeStart - When daytime begins (HH:MM)
 * @param {string} nighttimeStart - When nighttime begins (HH:MM)
 * @param {string} currentTime - Current time (HH:MM) or null for current system time
 * @returns {'day' | 'night'} - The currently active period
 */
export function getCurrentPeriod(daytimeStart, nighttimeStart, currentTime = null) {
  const now = currentTime 
    ? timeToMinutes(currentTime)
    : (() => {
        const d = new Date();
        return d.getHours() * 60 + d.getMinutes();
      })();
  
  const dayMinutes = timeToMinutes(daytimeStart);
  const nightMinutes = timeToMinutes(nighttimeStart);
  
  // Determine which period we're in
  if (dayMinutes < nightMinutes) {
    // Normal case: day comes before night (e.g., 6 AM to 10 PM)
    if (now >= dayMinutes && now < nightMinutes) {
      return 'day';
    } else {
      return 'night';
    }
  } else {
    // Wraps midnight: night comes before day (e.g., 10 PM to 6 AM)
    if (now >= nightMinutes && now < dayMinutes) {
      return 'night';
    } else {
      return 'day';
    }
  }
}


/**
 * Format time for display (24-hour format)
 */
function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * ThermostatClock Component
 * Displays a circular clock with temperature and time controls
 * Supports dual-period scheduling with active/inactive state indicators
 * 
 * @param {string} mode - 'day' or 'night'
 * @param {number} temperature - Current temperature setting
 * @param {string} time - Current time setting (HH:MM format)
 * @param {function} onTemperatureChange - Callback when temperature changes
 * @param {function} onTimeChange - Callback when time changes
 * @param {number} minTemp - Minimum temperature (default: 50)
 * @param {number} maxTemp - Maximum temperature (default: 85)
 * @param {boolean} isActive - Whether this period is currently active (optional)
 * @param {string} otherTime - The other clock's time for duration calculation (optional)
 * @param {boolean} showDuration - Whether to show duration display (default: true)
 */
export default function ThermostatClock({
  mode = "day",
  temperature = 70,
  time = "08:00",
  onTemperatureChange,
  onTimeChange,
  minTemp = 50,
  maxTemp = 85,
  isActive = null,
  otherTime = null,
  showDuration = true,
}) {
  // Calculate duration if otherTime is provided
  const duration = otherTime 
    ? calculateDuration(time, otherTime)
    : null;
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef(null);
  const handRef = useRef(null);

  // Use local state to track the displayed time, but sync with prop changes
  const [displayTime, setDisplayTime] = useState(time);
  
  // State for text input with AM/PM
  const [inputHours, setInputHours] = useState(() => {
    const [h] = time.split(":").map(Number);
    return h % 12 || 12;
  });
  const [inputMinutes, setInputMinutes] = useState(() => {
    const [, m] = time.split(":").map(Number);
    return m;
  });
  const [inputPeriod, setInputPeriod] = useState(() => {
    const [h] = time.split(":").map(Number);
    return h >= 12 ? "PM" : "AM";
  });
  
  // Update display time when prop changes (for linked clock updates)
  useEffect(() => {
    setDisplayTime(time);
    const [h, m] = time.split(":").map(Number);
    setInputHours(h % 12 || 12);
    setInputMinutes(m);
    setInputPeriod(h >= 12 ? "PM" : "AM");
  }, [time]);

  // Handle timeline dragging
  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!clockRef.current) return;
      
      setIsDragging(true);
      const rect = clockRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const minutes = Math.round((percent / 100) * (24 * 60));
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const newTime = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
      setDisplayTime(newTime);
      const [h, m] = newTime.split(":").map(Number);
      setInputHours(h % 12 || 12);
      setInputMinutes(m);
      setInputPeriod(h >= 12 ? "PM" : "AM");
      onTimeChange?.(newTime);
    },
    [onTimeChange]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging || !clockRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      
      const rect = clockRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const minutes = Math.round((percent / 100) * (24 * 60));
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const newTime = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
      setDisplayTime(newTime);
      const [h, m] = newTime.split(":").map(Number);
      setInputHours(h % 12 || 12);
      setInputMinutes(m);
      setInputPeriod(h >= 12 ? "PM" : "AM");
      onTimeChange?.(newTime);
    },
    [isDragging, onTimeChange]
  );

  const handlePointerUp = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove, { passive: false });
      document.addEventListener("pointerup", handlePointerUp, { passive: false });
      document.addEventListener("pointercancel", handlePointerUp, { passive: false });
      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.removeEventListener("pointercancel", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const isDay = mode === "day";
  const Icon = isDay ? Sun : Moon;
  const modeLabel = isDay ? "Daytime" : "Nighttime";
  
  // Determine ring color based on active state
  const ringColorClass = isActive === true
    ? (isDay ? "ring-2 ring-yellow-400 ring-offset-2" : "ring-2 ring-blue-400 ring-offset-2")
    : isActive === false
    ? "ring-1 ring-gray-300 dark:ring-gray-600 opacity-75"
    : "";

  return (
    <div className={`flex flex-col items-center gap-4 p-4 rounded-xl transition-all duration-300 ${ringColorClass} ${isActive === true ? 'bg-gradient-to-b ' + (isDay ? 'from-yellow-50/50 to-transparent dark:from-yellow-900/20' : 'from-blue-50/50 to-transparent dark:from-blue-900/20') : ''}`}>
      {/* Mode Label with Active Indicator */}
      <div className="flex items-center gap-2">
        <Icon
          className={`w-5 h-5 ${
            isDay
              ? "text-yellow-500 dark:text-yellow-400"
              : "text-blue-500 dark:text-blue-400"
          }`}
        />
        <span className="text-sm font-semibold text-high-contrast">
          {modeLabel} Setting
        </span>
        {isActive === true && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            isDay 
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" 
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
          }`}>
            <Zap className="w-3 h-3" />
            Active
          </span>
        )}
      </div>
      
      {/* Duration Display */}
      {showDuration && duration !== null && (
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span>Runs for <strong className="text-high-contrast">{formatDuration(duration)}</strong></span>
        </div>
      )}

      {/* Linear Timeline Slider */}
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Timeline Bar */}
          <div
            ref={clockRef}
            className="relative h-16 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer select-none"
            style={{ touchAction: "none" }}
            onPointerDown={handlePointerDown}
          >
            {/* Hour markers */}
            <div className="absolute inset-0 flex justify-between items-center px-2">
              {[0, 6, 12, 18, 24].map((hour) => {
                const percent = (hour / 24) * 100;
                return (
                  <div
                    key={hour}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
                  >
                    <div className={`w-0.5 h-4 ${
                      hour % 6 === 0 ? "h-6" : "h-3"
                    } bg-gray-400 dark:bg-gray-500`} />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 font-medium">
                      {hour === 0 || hour === 24 ? "12a" : hour === 12 ? "12p" : hour < 12 ? `${hour}a` : `${hour - 12}p`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Draggable Handle */}
            <div
              ref={handRef}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100 ${
                isDragging ? "opacity-80 scale-110 cursor-grabbing" : "opacity-100 cursor-grab"
              }`}
              style={{
                left: `${(timeToMinutes(displayTime) / (24 * 60)) * 100}%`,
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
            >
              {/* Handle circle */}
              <div className={`w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center ${
                isDay
                  ? "bg-yellow-500 dark:bg-yellow-400"
                  : "bg-blue-500 dark:bg-blue-400"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isDay
                    ? "bg-yellow-700 dark:bg-yellow-600"
                    : "bg-blue-700 dark:bg-blue-600"
                }`} />
              </div>
              {/* Time label above handle */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 rounded-md px-2 py-1 shadow-md border border-gray-300 dark:border-gray-600">
                <div className={`text-sm font-bold ${
                  isDay
                    ? "text-yellow-700 dark:text-yellow-400"
                    : "text-blue-700 dark:text-blue-400"
                }`}>
                  {formatTime(displayTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Input with AM/PM dropdown */}
      <div className="w-full max-w-xs">
        <label className="block text-xs font-medium text-muted mb-2 text-center">
          Set Time:
        </label>
        <div className="flex items-center gap-2 justify-center">
          <input
            type="number"
            min="1"
            max="12"
            value={inputHours}
            onChange={(e) => {
              const val = Math.max(1, Math.min(12, parseInt(e.target.value) || 1));
              setInputHours(val);
              const hours24 = inputPeriod === "PM" 
                ? (val === 12 ? 12 : val + 12)
                : (val === 12 ? 0 : val);
              const newTime = `${String(hours24).padStart(2, "0")}:${String(inputMinutes).padStart(2, "0")}`;
              setDisplayTime(newTime);
              onTimeChange?.(newTime);
            }}
            className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-high-contrast"
          />
          <span className="text-high-contrast">:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={inputMinutes}
            onChange={(e) => {
              const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
              setInputMinutes(val);
              const hours24 = inputPeriod === "PM" 
                ? (inputHours === 12 ? 12 : inputHours + 12)
                : (inputHours === 12 ? 0 : inputHours);
              const newTime = `${String(hours24).padStart(2, "0")}:${String(val).padStart(2, "0")}`;
              setDisplayTime(newTime);
              onTimeChange?.(newTime);
            }}
            className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-high-contrast"
          />
          <select
            value={inputPeriod}
            onChange={(e) => {
              const period = e.target.value;
              setInputPeriod(period);
              const hours24 = period === "PM" 
                ? (inputHours === 12 ? 12 : inputHours + 12)
                : (inputHours === 12 ? 0 : inputHours);
              const newTime = `${String(hours24).padStart(2, "0")}:${String(inputMinutes).padStart(2, "0")}`;
              setDisplayTime(newTime);
              onTimeChange?.(newTime);
            }}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-high-contrast"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="w-full max-w-xs">
        <label className="block text-xs font-medium text-muted mb-2 text-center">
          Temperature: {temperature}°F
        </label>
        <input
          type="range"
          min={minTemp}
          max={maxTemp}
          value={temperature}
          onChange={(e) => onTemperatureChange?.(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
          style={{
            background: `linear-gradient(to right, ${
              isDay ? "#fbbf24" : "#3b82f6"
            } 0%, ${isDay ? "#fbbf24" : "#3b82f6"} ${
              ((temperature - minTemp) / (maxTemp - minTemp)) * 100
            }%, #e5e7eb ${
              ((temperature - minTemp) / (maxTemp - minTemp)) * 100
            }%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>{minTemp}°F</span>
          <span>{maxTemp}°F</span>
        </div>
      </div>
    </div>
  );
}

