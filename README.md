# SkyCast Weather App

SkyCast is an Expo + React Native weather search app that lets users search for a city and get current weather information from OpenWeather.

The app uses a two-step API flow:

1. Geocoding API to resolve city name to latitude/longitude.
2. Current Weather API to fetch temperature and description by coordinates.

## Features

- City search with keyboard submit support.
- Invalid city detection with toast feedback.
- Loading state while requesting API data.
- Weather card showing:
  - City name
  - Temperature in Celsius
  - Weather description
- Blue and yellow weather-themed UI (sky + sun visual direction).

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- react-native-root-toast
- OpenWeather API

## Environment Variables

Create a local `.env` file from `.env.example` and set your key:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_real_openweather_api_key
```

Notes:

- `EXPO_PUBLIC_*` variables are available in app code at build/runtime.
- Do not commit real keys.
- `.env.example` should contain placeholder values only.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment variables (see section above)

3. Start development server

```bash
npx expo start
```

4. Optional platform shortcuts

```bash
npm run android
npm run ios
npm run web
```

## Project Structure

- `app/(tabs)/index.tsx`
  - Main weather UI and search logic
  - Loading state and error/toast handling
- `services/weatherService.js`
  - OpenWeather API calls
  - Geocoding result validation
  - Environment variable API key resolution
- `assets/images/`
  - App icon and weather-related artwork

## Weather Request Flow

1. User enters a city name.
2. App calls `/geo/1.0/direct?q={city}&limit=1&appid={key}`.
3. If no valid coordinates are returned, app shows an invalid-city message.
4. If coordinates are valid, app calls `/data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units=metric`.
5. UI displays weather result card.

## Error Handling Behavior

- Empty input: prompts user to enter a city name.
- Invalid city: shows toast and no weather result is displayed.
- Network/API error: shows alert with retry guidance.

## Scripts

- `npm run start` - Start Expo development server
- `npm run android` - Launch Android target
- `npm run ios` - Launch iOS target
- `npm run web` - Launch web target
- `npm run lint` - Run lint checks

## Screenshots

Add screenshots here for easier review:

- Valid city result state
- Invalid city toast state

## Future Improvements

- Add 5-day forecast support.
- Add location disambiguation (city/state/country selector).
- Add search history and favorites.
- Move weather calls to backend proxy for stronger key protection.
