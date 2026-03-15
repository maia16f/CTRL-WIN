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
  const [gender, setGender] = useState('male');
  const [photoURI, setPhotoURI] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setPhotoURI(uri);
  };

  const handleAddPet = async () => {
    if (!name || !breed || !age) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }

    setLoading(true);
    try {
      let photoURL = '';
      if (photoURI) {
        photoURL = await uploadPhoto(photoURI, `pets/${auth.currentUser.uid}`);
      }

      await addDoc(collection(db, 'pets'), {
        ownerId: auth.currentUser.uid,
        name,
        species,
        breed,
        age: parseInt(age, 10),
        gender,
        photoURL,
        createdAt: serverTimestamp()
      });

      Alert.alert('Succes', 'Animalul a fost adăugat cu succes!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut adăuga animalul: ' + error.message);
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
          <Text style={styles.imagePickerText}>Adaugă o poză</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Numele animalului" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Rasa" value={breed} onChangeText={setBreed} />
      <TextInput style={styles.input} placeholder="Vârsta (în luni)" value={age} onChangeText={setAge} keyboardType="numeric" />
      
      <View style={styles.row}>
        <TouchableOpacity style={[styles.selector, species === 'dog' && styles.selected]} onPress={() => setSpecies('dog')}>
          <Text style={styles.selectorText}>Câine</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.selector, species === 'cat' && styles.selected]} onPress={() => setSpecies('cat')}>
          <Text style={styles.selectorText}>Pisică</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddPet} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Se adaugă...' : 'Adaugă Animal'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  input: { backgroundColor: COLORS.white, padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
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
