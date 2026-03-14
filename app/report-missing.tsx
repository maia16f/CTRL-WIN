import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db, storage } from '../firebaseConfig';

export default function ReportMissingScreen() {
  const router = useRouter();
  const [petName, setPetName] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Funcția pentru a alege o poză din galerie
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Calitate redusă pentru a se încărca mai repede
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Funcția pentru a trimite datele în Firebase
  const handleSubmit = async () => {
    if (!petName || !location || !imageUri) {
      Alert.alert('Atenție', 'Te rog completează toate câmpurile și adaugă o poză!');
      return;
    }

    setLoading(true);
    try {
      // 1. Încărcăm poza în Firebase Storage
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `missing_pets/${Date.now()}-${auth.currentUser?.uid}.jpg`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef); // Obținem link-ul pozei

      // 2. Salvăm datele (text + link poză) în Firestore Database
      await addDoc(collection(db, 'missingPets'), {
        petName,
        location,
        imageUrl: downloadUrl,
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        status: 'missing',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Succes', 'Anunțul a fost adăugat!');
      router.replace('/(tabs)'); // Ne întoarcem pe pagina principală

    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} />
          </TouchableOpacity>
          <Text style={styles.logoTitle}>PawRadar</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.mainTitle}>Have you lost a pet? Let's bring him back home!</Text>
        <Text style={styles.pillsLabel}>Pills</Text>

        {/* Buton pentru Poză */}
        <View style={styles.pill}><Text style={styles.pillText}>Pet's photo:</Text></View>
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.imageBoxText}>Tap to upload pet photo</Text>
          )}
        </TouchableOpacity>

        {/* Numele animalului */}
        <View style={styles.pill}><Text style={styles.pillText}>Pet's name:</Text></View>
        <TextInput 
          style={styles.input} 
          placeholder="Enter name (e.g. Max)" 
          value={petName}
          onChangeText={setPetName}
        />

        {/* Locația */}
        <View style={styles.pill}><Text style={styles.pillText}>Last seen at:</Text></View>
        <TextInput 
          style={styles.input} 
          placeholder="Enter location" 
          value={location}
          onChangeText={setLocation}
        />

        {/* Buton de Trimitere */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Post Missing Pet</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#E57373' },
  mainTitle: { fontSize: 20, fontWeight: 'bold', color: '#E57373', textAlign: 'center', marginBottom: 20 },
  pillsLabel: { color: '#CCC', marginBottom: 10 },
  pill: { backgroundColor: '#F08080', alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginBottom: 5, marginTop: 10 },
  pillText: { color: '#FFF', fontWeight: '600' },
  input: { borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 10, fontSize: 16, color: '#888', marginBottom: 20 },
  imageBox: { height: 150, backgroundColor: '#F9F9F9', borderRadius: 10, borderWidth: 1, borderColor: '#DDD', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  imageBoxText: { color: '#888' },
  previewImage: { width: '100%', height: '100%', borderRadius: 10 },
  submitBtn: { backgroundColor: '#E57373', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});