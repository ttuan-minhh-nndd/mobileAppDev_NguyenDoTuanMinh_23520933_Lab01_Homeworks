// utils/weatherService.js
const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

const getApiKeyOrThrow = () => {
  if (!API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_OPENWEATHER_API_KEY in environment variables');
  }

  return API_KEY;
};

export const getCoordsByCity = async (cityName) => {
  const apiKey = getApiKeyOrThrow();
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0]; // Returns { lat, lon, name, etc. }
};

export const getWeatherByCoords = async (lat, lon) => {
  const apiKey = getApiKeyOrThrow();
  const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  return await response.json();
};
