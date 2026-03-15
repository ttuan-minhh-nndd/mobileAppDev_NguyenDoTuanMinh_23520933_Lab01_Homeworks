import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-root-toast';
import { getCoordsByCity, getWeatherByCoords } from '../../services/weatherService';

type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
};

export default function TabOneScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const showCityNotFound = () => {
    if (Toast?.show) {
      Toast.show('This city does not exist', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
      return;
    }

    Alert.alert('City not found', 'This city does not exist');
  };

  const fetchFullWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      return;
    }

    setLoading(true);
    setWeather(null);

    try {
      // 1. Get Coordinates from City Name
      const location = await getCoordsByCity(trimmedCity);

      if (!location) {
        showCityNotFound();
        return;
      }

      // 2. Use those coords to get Weather
      const weatherData = await getWeatherByCoords(location.lat, location.lon);
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', 'Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Enter City (e.g. London)" 
        value={city}
        onChangeText={setCity}
        autoCapitalize="words"
        returnKeyType="search"
        onSubmitEditing={fetchFullWeather}
      />
      <Button title="Get Weather" onPress={fetchFullWeather} />

      {loading && <ActivityIndicator size="large" />}

      {weather && (
        <ThemedView style={styles.result}>
          <ThemedText style={styles.title}>{weather.name}</ThemedText>
          <ThemedText style={styles.temperature}>{weather.main.temp.toFixed(1)}°C</ThemedText>
          <ThemedText style={styles.description}>{weather.weather[0].description}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '90%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#cfcfcf',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  temperature: {
    fontSize: 38,
    fontWeight: '700',
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    marginTop: 6,
    textTransform: 'capitalize',
  },
  result: {
    marginTop: 30,
    alignItems: 'center',
  },
});
