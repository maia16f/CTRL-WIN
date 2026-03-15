import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import { MapView, Marker } from '../../components/map/MapWrapper';
import { COLORS } from '../../utils/constants';

const DEFAULT_REGION = {
  latitude: 44.4268,
  longitude: 26.1025,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const PickLocationScreen = ({ navigation, route }) => {
  const initialCoords = route.params?.initialCoords;
  const [region, setRegion] = useState(
    initialCoords
      ? {
          latitude: initialCoords.lat,
          longitude: initialCoords.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }
      : null
  );
  const [loading, setLoading] = useState(!initialCoords);

  useEffect(() => {
    navigation.setOptions({ title: 'Alege locația pe hartă' });
  }, [navigation]);

  useEffect(() => {
    if (region || Platform.OS === 'web') {
      if (!region) setRegion(DEFAULT_REGION);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setRegion(DEFAULT_REGION);
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } catch {
        setRegion(DEFAULT_REGION);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleConfirm = () => {
    if (!region) return;
    const coords = { lat: region.latitude, lng: region.longitude };
    if (route.params?.onLocationPicked) {
      route.params.onLocationPicked(coords);
    }
    navigation.goBack();
  };

  if (loading || !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.hint}>
          Mișcă harta până când pin-ul e exact acolo unde s-a pierdut / găsit animalul.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirm} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Confirmă locația</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  hint: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PickLocationScreen;

