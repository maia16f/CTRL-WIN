import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // După delogare, trimitem utilizatorul înapoi pe prima pagină (Home)
      router.replace('/(tabs)'); 
    } catch (error: any) {
      Alert.alert('Eroare la delogare', error.message);
    }
  };

  // Dacă nu este logat
  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.authText}>Trebuie să fii logat pentru a vedea profilul.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth')}>
          <Text style={styles.loginBtnText}>Mergi la Logare</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dacă este logat
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle" size={80} color="#E57373" />
        <Text style={styles.emailText}>{user.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Ieșire din cont</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  authText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  loginBtn: { backgroundColor: '#E57373', padding: 15, borderRadius: 10 },
  loginBtnText: { color: '#FFF', fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#FFF', padding: 20, paddingTop: 60, alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  emailText: { fontSize: 18, fontWeight: 'bold', marginTop: 10, color: '#333' },
  logoutButton: { flexDirection: 'row', backgroundColor: '#333', padding: 15, borderRadius: 12, alignItems: 'center', width: '100%', justifyContent: 'center', marginTop: 'auto', marginBottom: 20 },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});