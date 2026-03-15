import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { COLORS } from '../../utils/constants';

const PetProfileScreen = ({ route }) => {
  const { pet } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: pet.photoURL || 'https://via.placeholder.com/300' }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.detail}>🐾 Specie: {pet.species}</Text>
        <Text style={styles.detail}>🏷️ Rasă: {pet.breed}</Text>
        <Text style={styles.detail}>🎂 Vârstă: {pet.age} luni</Text>
        <Text style={styles.detail}>⚧ Gen: {pet.gender === 'male' ? 'Mascul' : 'Femelă'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: 300 },
  infoContainer: { padding: 20, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  name: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  detail: { fontSize: 16, color: COLORS.textDark, marginBottom: 10, fontWeight: '500' }
});

export default PetProfileScreen;
