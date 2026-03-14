import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function AddPetScreen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  if (!auth.currentUser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.authText}>Trebuie să fii logat pentru a adăuga un anunț.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth')}>
          <Text style={styles.loginBtnText}>Mergi la Logare</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Raportează un animal</Text>
      <TouchableOpacity style={styles.imagePicker}>
        <Ionicons name="camera" size={40} color="#E57373" />
        <Text style={{ color: '#E57373' }}>Adaugă o fotografie</Text>
      </TouchableOpacity>
      <View style={styles.form}>
        <Text style={styles.label}>Numele animalului (dacă se știe)</Text>
        <TextInput style={styles.input} placeholder="Ex: Pufi" value={name} onChangeText={setName} />
        <Text style={styles.label}>Locația unde a fost văzut</Text>
        <TextInput style={styles.input} placeholder="Ex: Str. Trandafirilor" value={location} onChangeText={setLocation} />
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Publică Anunțul</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  authText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  loginBtn: { backgroundColor: '#E57373', padding: 15, borderRadius: 10 },
  loginBtnText: { color: '#FFF', fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#FFF', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E57373', marginBottom: 20 },
  imagePicker: { height: 200, backgroundColor: '#FFF1F1', borderRadius: 15, borderWidth: 2, borderColor: '#E57373', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  form: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  submitButton: { backgroundColor: '#E57373', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});