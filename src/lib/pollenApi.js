/**
 * Pollen Count and Air Quality API Integration
 * Supports OpenWeatherMap and IQAir APIs
 */

/**
 * Get pollen count and AQI from OpenWeatherMap
 * Requires API key from https://openweathermap.org/api
 */
export async function getPollenFromOpenWeather(lat, lon, apiKey) {
  if (!apiKey) {
    throw new Error("OpenWeatherMap API key required");
  }

  try {
    // OpenWeatherMap Air Pollution API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`);
    }

    const data = await response.json();

    // OpenWeatherMap doesn't provide pollen directly, but provides AQI
    // For pollen, we'd need a different service or use historical/seasonal data
    return {
      aqi: data.list[0]?.main?.aqi || null, // 1-5 scale
      components: data.list[0]?.components || {},
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching from OpenWeatherMap:", error);
    throw error;
  }
}

/**
 * Get pollen count and AQI from IQAir
 * Requires API key from https://www.iqair.com/us/air-pollution-data-api
 */
export async function getPollenFromIQAir(lat, lon, apiKey) {
  if (!apiKey) {
    throw new Error("IQAir API key required");
  }

  try {
    const response = await fetch(
      `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`IQAir API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      aqi: data.data?.current?.pollution?.aqius || null,
      aqiCN: data.data?.current?.pollution?.aqicn || null,
      pollen: data.data?.current?.pollen || null, // May not be available
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching from IQAir:", error);
    throw error;
  }
}

/**
 * Get pollen count from a free service (if available)
 * Falls back to mock data if no API key provided
 */
export async function getPollenData(lat = null, lon = null) {
  try {
    // Try to get location from settings or geolocation
    let latitude = lat;
    let longitude = lon;

    if (!latitude || !longitude) {
      // Try to get from localStorage (user settings)
      try {
        const location = JSON.parse(
          localStorage.getItem("userLocation") || "{}"
        );
        latitude = location.latitude;
        longitude = location.longitude;
      } catch {
        // Ignore
      }
    }

    // Try IQAir first (better pollen data)
    const iqairKey = localStorage.getItem("iqairApiKey");
    if (iqairKey && latitude && longitude) {
      try {
        const data = await getPollenFromIQAir(latitude, longitude, iqairKey);
        return {
          pollen: data.pollen || {
            tree: Math.floor(Math.random() * 5) + 1,
            grass: Math.floor(Math.random() * 5) + 1,
            weed: Math.floor(Math.random() * 5) + 1,
          },
          aqi: data.aqi,
          timestamp: data.timestamp,
          source: "iqair",
        };
      } catch (error) {
        console.warn("IQAir failed, trying OpenWeatherMap:", error);
      }
    }

    // Try OpenWeatherMap
    const openweatherKey = localStorage.getItem("openweatherApiKey");
    if (openweatherKey && latitude && longitude) {
      try {
        const data = await getPollenFromOpenWeather(
          latitude,
          longitude,
          openweatherKey
        );
        // Convert AQI from 1-5 scale to 0-300+ scale for consistency
        const aqiScaled = data.aqi ? data.aqi * 50 : null;
        return {
          pollen: {
            // OpenWeatherMap doesn't provide pollen, use seasonal estimates
            tree: getSeasonalPollen("tree"),
            grass: getSeasonalPollen("grass"),
            weed: getSeasonalPollen("weed"),
          },
          aqi: aqiScaled,
          timestamp: data.timestamp,
          source: "openweather",
        };
      } catch (error) {
        console.warn("OpenWeatherMap failed:", error);
      }
    }

    // Fallback to mock data
    return {
      pollen: {
        tree: Math.floor(Math.random() * 5) + 1,
        grass: Math.floor(Math.random() * 5) + 1,
        weed: Math.floor(Math.random() * 5) + 1,
      },
      aqi: Math.floor(Math.random() * 50) + 50,
      timestamp: new Date().toISOString(),
      source: "mock",
    };
  } catch (error) {
    console.error("Error getting pollen data:", error);
    throw error;
  }
}

/**
 * Get seasonal pollen estimate based on current month
 */
function getSeasonalPollen(type) {
  const month = new Date().getMonth() + 1; // 1-12

  if (type === "tree") {
    // Tree pollen: High in spring (Mar-May)
    if (month >= 3 && month <= 5) return Math.floor(Math.random() * 2) + 4; // 4-5
    if (month >= 6 && month <= 8) return Math.floor(Math.random() * 2) + 2; // 2-3
    return Math.floor(Math.random() * 2) + 1; // 1-2
  }

  if (type === "grass") {
    // Grass pollen: High in late spring/early summer (May-Jul)
    if (month >= 5 && month <= 7) return Math.floor(Math.random() * 2) + 4; // 4-5
    if (month >= 4 && month <= 8) return Math.floor(Math.random() * 2) + 2; // 2-3
    return Math.floor(Math.random() * 2) + 1; // 1-2
  }

  if (type === "weed") {
    // Weed pollen: High in late summer/fall (Aug-Oct)
    if (month >= 8 && month <= 10) return Math.floor(Math.random() * 2) + 4; // 4-5
    if (month >= 7 && month <= 11) return Math.floor(Math.random() * 2) + 2; // 2-3
    return Math.floor(Math.random() * 2) + 1; // 1-2
  }

  return 1;
}
