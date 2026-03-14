import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function ExploreScreen() {
  // Coordonatele pentru centrul hărții (am pus Timișoara, dar poți schimba)
  const mapRegion = {
    latitude: 45.7489,
    longitude: 21.2087,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoTitle}>PawRadar</Text>
        <Text style={styles.subtitle}>Search Area</Text>
      </View>

      <Text style={styles.alertText}>Lost pet near you!</Text>

      {/* Containerul Hărții */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={mapRegion}>
          
          {/* Pin-ul principal (Roșu) */}
          <Marker coordinate={{ latitude: 45.7489, longitude: 21.2087 }}>
            <Ionicons name="location" size={50} color="#E53935" style={styles.mainPin} />
          </Marker>

          {/* Icoane cu Lăbuțe */}
          <Marker coordinate={{ latitude: 45.7550, longitude: 21.1980 }}>
            <View style={styles.pawMarker}><Ionicons name="paw" size={24} color="#333" /></View>
          </Marker>
          <Marker coordinate={{ latitude: 45.7410, longitude: 21.2150 }}>
            <View style={styles.pawMarker}><Ionicons name="paw" size={24} color="#333" /></View>
          </Marker>
          <Marker coordinate={{ latitude: 45.7520, longitude: 21.2250 }}>
            <View style={styles.pawMarker}><Ionicons name="paw" size={24} color="#333" /></View>
          </Marker>

          {/* Icoane cu Warning (Atenție) */}
          <Marker coordinate={{ latitude: 45.7600, longitude: 21.2100 }}>
            <Ionicons name="warning" size={45} color="#FFCA28" />
          </Marker>
          <Marker coordinate={{ latitude: 45.7400, longitude: 21.1900 }}>
            <Ionicons name="warning" size={45} color="#FFCA28" />
          </Marker>

        </MapView>
      </View>

      {/* Butonul de jos */}
      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpText}>HELP FIND THE PET!!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center' },
  header: { marginTop: 40, alignItems: 'center', marginBottom: 20 },
  logoTitle: { fontSize: 24, fontWeight: 'bold', color: '#F08080' },
  subtitle: { fontSize: 20, color: '#F08080' },
  alertText: { fontSize: 22, fontWeight: 'bold', color: '#F08080', marginBottom: 20 },
  mapContainer: {
    width: '90%',
    height: 400, // Înălțimea hărții
    overflow: 'hidden',
  },
  map: { width: '100%', height: '100%' },
  mainPin: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 5
  },
  pawMarker: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  helpButton: { marginTop: 30, padding: 15 },
  helpText: { fontSize: 20, fontWeight: 'bold', color: '#F08080' }
});