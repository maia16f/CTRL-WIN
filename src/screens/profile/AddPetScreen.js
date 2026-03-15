import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { COLORS } from '../../utils/constants';
import { db, auth } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { pickImage, uploadPhoto } from '../../services/storageService';

const AddPetScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState('luni');
  const [gender, setGender] = useState('male');
  const [photoURI, setPhotoURI] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setPhotoURI(uri);
  };

  const handleAddPet = async () => {
    if (!name || !breed || !age) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      let photoURL = '';
      if (photoURI) {
        photoURL = await uploadPhoto(photoURI, `pets/${auth.currentUser.uid}`);
      }

      const ageMonths = ageUnit === 'ani' ? parseInt(age, 10) * 12 : parseInt(age, 10);
      await addDoc(collection(db, 'pets'), {
        ownerId: auth.currentUser.uid,
        name,
        species,
        breed,
        age: ageMonths,
        gender,
        photoURL,
        createdAt: serverTimestamp()
      });

      Alert.alert('Success', 'Pet has been added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not add pet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {photoURI ? (
          <Image source={{ uri: photoURI }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Add a photo</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Pet name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />

      <Text style={styles.label}>Age</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.ageInput]}
          placeholder="Number"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <View style={styles.unitRow}>
          <TouchableOpacity style={[styles.selector, ageUnit === 'luni' && styles.selected]} onPress={() => setAgeUnit('luni')}>
            <Text style={styles.selectorText}>Months</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selector, ageUnit === 'ani' && styles.selected]} onPress={() => setAgeUnit('ani')}>
            <Text style={styles.selectorText}>Years</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.selector, gender === 'male' && styles.selected]} onPress={() => setGender('male')}>
          <Text style={styles.selectorText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.selector, gender === 'female' && styles.selected]} onPress={() => setGender('female')}>
          <Text style={styles.selectorText}>Female</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.selector, species === 'dog' && styles.selected]} onPress={() => setSpecies('dog')}>
          <Text style={styles.selectorText}>Dog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.selector, species === 'cat' && styles.selected]} onPress={() => setSpecies('cat')}>
          <Text style={styles.selectorText}>Cat</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddPet} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add pet'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  input: { backgroundColor: COLORS.white, padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  ageInput: { flex: 1, marginRight: 10, marginBottom: 0 },
  unitRow: { flexDirection: 'row', flex: 1 },
  selector: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 8, marginHorizontal: 5, borderWidth: 1, borderColor: '#ddd' },
  selected: { backgroundColor: COLORS.secondary, borderColor: COLORS.primary },
  selectorText: { fontWeight: 'bold', color: COLORS.textDark },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  imagePicker: { height: 150, backgroundColor: '#e1e1e1', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  imagePickerText: { color: COLORS.textLight, fontWeight: 'bold' },
  image: { width: '100%', height: '100%', borderRadius: 8 }
});

export default AddPetScreen;
