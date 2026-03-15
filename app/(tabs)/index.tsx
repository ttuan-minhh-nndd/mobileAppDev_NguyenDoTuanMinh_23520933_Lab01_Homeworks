import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
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
      Toast.show('This is an invalid city name', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#153b7a',
        textColor: '#fff',
      });
      return;
    }

    Alert.alert('City not found', 'This is an invalid city name');
  };

  const fetchFullWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      if (Toast?.show) {
        Toast.show('Please enter a city name', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      }
      return;
    }

    setLoading(true);
    setWeather(null);

    try {
      // 1. Get Coordinates from City Name
      const location = await getCoordsByCity(trimmedCity);
      const hasValidCoordinates =
        !!location && Number.isFinite(location.lat) && Number.isFinite(location.lon);

      if (!hasValidCoordinates) {
        showCityNotFound();
        return;
      }

      // 2. Use those coords to get Weather
      const weatherData = await getWeatherByCoords(location.lat, location.lon);

      if (!weatherData?.main || !weatherData?.weather?.length) {
        showCityNotFound();
        return;
      }

      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', 'Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/cute-sun-cloud-icon.png')}
        style={styles.heroImage}
        resizeMode='contain' />
      <ThemedView style={styles.panel}>
        <ThemedText style={styles.header}>[OPENAZURE]</ThemedText>
        <ThemedText style={styles.subheader}>Search city weather in seconds</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Enter a city (e.g. Ho Chi Minh City)"
          placeholderTextColor="#5d83b9"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={fetchFullWeather}
        />

        <Pressable style={styles.button} onPress={fetchFullWeather} disabled={loading}>
          <ThemedText style={styles.buttonText}>{loading ? 'Loading...' : 'Get Weather'}</ThemedText>
        </Pressable>

        {loading && <ActivityIndicator size="large" color="#0e56c8" style={styles.loader} />}

        {weather && (
          <ThemedView style={styles.result}>
            <ThemedText style={styles.title}>{weather.name}</ThemedText>
            <ThemedText style={styles.temperature}>{weather.main.temp.toFixed(1)}°C</ThemedText>
            <ThemedText style={styles.description}>{weather.weather[0].description}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#74b8ff',
  },
  panel: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#f5fbff',
    borderWidth: 1,
    borderColor: '#b7ddff',
    shadowColor: '#0d4ea3',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  header: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f4b9a',
    textAlign: 'center',
  },
  subheader: {
    marginTop: 10,
    marginBottom: 16,
    textAlign: 'center',
    color: '#1d6ecf',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#9fcbff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    color: '#153b7a',
  },
  button: {
    backgroundColor: '#0e56c8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  loader: {
    marginTop: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#153b7a',
  },
  temperature: {
    fontSize: 38,
    fontWeight: '700',
    marginTop: 10,
    color: '#f39b00',
  },
  description: {
    fontSize: 18,
    marginTop: 6,
    textTransform: 'capitalize',
    color: '#1b65bf',
  },
  result: {
    marginTop: 22,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ffe7a8',
    backgroundColor: '#fff9e4',
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  heroImage: {
    width: '80%',               // Responsive width
    maxWidth: 400,              // Prevents it from being too big on Web
    height: 300,                // Fixed height to maintain layout structure
    marginBottom: 20,           // Space between image and the "SkyCast" panel
    alignSelf:'center',
  },
});
