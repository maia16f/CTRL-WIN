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
        <Text style={styles.detail}>🐾 Species: {pet.species}</Text>
        <Text style={styles.detail}>🏷️ Breed: {pet.breed}</Text>
        <Text style={styles.detail}>🎂 Age: {pet.age >= 12 ? `${Math.floor(pet.age / 12)} years` : `${pet.age} months`}</Text>
        <Text style={styles.detail}>⚧ Gender: {pet.gender === 'male' ? 'Male' : 'Female'}</Text>
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
