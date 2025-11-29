import { useState, useEffect, useCallback } from "react";
import {
  getThermostatData,
  setThermostatTemperature,
  setThermostatMode,
  setAwayMode,
  resumeSchedule,
  getEcobeeCredentials,
  requestEcobeePin,
  exchangePinForToken,
} from "../lib/ecobeeApi";

/**
 * React hook for Ecobee thermostat integration
 *
 * @param {string} thermostatId - Optional specific thermostat ID, otherwise uses first available
 * @param {number} pollInterval - Polling interval in milliseconds (default: 30000 = 30 seconds)
 * @returns {Object} Ecobee state and control functions
 */
export function useEcobee(thermostatId = null, pollInterval = 30000) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [thermostatData, setThermostatData] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Fetch thermostat data
  const fetchThermostatData = useCallback(async () => {
    try {
      setError(null);
      const data = await getThermostatData(thermostatId);
      setThermostatData(data);
      setConnected(true);
      setLoading(false);
      return data;
    } catch (err) {
      console.error("Error fetching Ecobee data:", err);
      setError(err.message);
      setConnected(false);
      setLoading(false);
      return null;
    }
  }, [thermostatId]);

  // Start polling
  useEffect(() => {
    const credentials = getEcobeeCredentials();
    if (!credentials.apiKey || !credentials.accessToken) {
      setLoading(false);
      setError("Ecobee not configured. Please authenticate in Settings.");
      return;
    }

    // Initial fetch
    fetchThermostatData();

    // Set up polling
    setIsPolling(true);
    const interval = setInterval(() => {
      fetchThermostatData();
    }, pollInterval);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [fetchThermostatData, pollInterval]);

  // Control functions
  const setTemperature = useCallback(
    async (heatTemp, coolTemp) => {
      try {
        setError(null);
        await setThermostatTemperature(thermostatId, heatTemp, coolTemp);
        // Refresh data after setting
        await fetchThermostatData();
        return { success: true };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [thermostatId, fetchThermostatData]
  );

  const setMode = useCallback(
    async (mode) => {
      try {
        setError(null);
        await setThermostatMode(thermostatId, mode);
        // Refresh data after setting
        await fetchThermostatData();
        return { success: true };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [thermostatId, fetchThermostatData]
  );

  const setAway = useCallback(
    async (enabled, heatTemp = null, coolTemp = null) => {
      try {
        setError(null);
        await setAwayMode(thermostatId, enabled, heatTemp, coolTemp);
        // Refresh data after setting
        await fetchThermostatData();
        return { success: true };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [thermostatId, fetchThermostatData]
  );

  const resume = useCallback(async () => {
    try {
      setError(null);
      await resumeSchedule(thermostatId);
      // Refresh data after resuming
      await fetchThermostatData();
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [thermostatId, fetchThermostatData]);

  return {
    // State
    loading,
    error,
    connected,
    thermostatData,
    isPolling,

    // Data (convenience accessors)
    temperature: thermostatData?.temperature || null,
    humidity: thermostatData?.humidity || null,
    targetHeatTemp: thermostatData?.targetHeatTemp || null,
    targetCoolTemp: thermostatData?.targetCoolTemp || null,
    mode: thermostatData?.mode || null,
    fanMode: thermostatData?.fanMode || null,
    isAway: thermostatData?.isAway || false,
    equipmentStatus: thermostatData?.equipmentStatus || null,
    name: thermostatData?.name || null,

    // Control functions
    setTemperature,
    setMode,
    setAway,
    resume,
    refresh: fetchThermostatData,
  };
}

/**
 * Hook for Ecobee authentication flow
 */
export function useEcobeeAuth() {
  const [authState, setAuthState] = useState({
    step: "idle", // 'idle', 'requesting-pin', 'waiting-auth', 'exchanging', 'authenticated', 'error'
    pin: null,
    authUrl: null,
    error: null,
  });

  const credentials = getEcobeeCredentials();
  const isAuthenticated = !!(credentials.apiKey && credentials.accessToken);

  const startAuth = useCallback(async (apiKey) => {
    try {
      setAuthState({
        step: "requesting-pin",
        pin: null,
        authUrl: null,
        error: null,
      });

      // Store API key
      localStorage.setItem("ecobeeApiKey", apiKey);

      const result = await requestEcobeePin(apiKey);

      setAuthState({
        step: "waiting-auth",
        pin: result.pin,
        authUrl: result.authUrl,
        error: null,
      });

      return result;
    } catch (error) {
      setAuthState({
        step: "error",
        pin: null,
        authUrl: null,
        error: error.message,
      });
      throw error;
    }
  }, []);

  const completeAuth = useCallback(async (apiKey, pin) => {
    try {
      setAuthState((prev) => ({ ...prev, step: "exchanging", error: null }));

      const result = await exchangePinForToken(apiKey, pin);

      setAuthState({
        step: "authenticated",
        pin: null,
        authUrl: null,
        error: null,
      });

      return result;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        step: "error",
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const checkAuthStatus = useCallback(
    async (apiKey) => {
      const storedPin = localStorage.getItem("ecobeePin");
      if (storedPin) {
        try {
          await completeAuth(apiKey, storedPin);
        } catch (error) {
          // If exchange fails, user needs to re-authenticate
          setAuthState({
            step: "idle",
            pin: null,
            authUrl: null,
            error: null,
          });
        }
      }
    },
    [completeAuth]
  );

  return {
    isAuthenticated,
    authState,
    startAuth,
    completeAuth,
    checkAuthStatus,
  };
}
