import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Marker = () => null;

const MapView = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🗺️ Interactive map is only available on phone (Android/iOS).</Text>
      {/* Nu randam children (Markerele) pe web pentru a evita alte crash-uri */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default MapView;
