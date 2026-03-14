import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function AddSelectionScreen() {
  const router = useRouter();

  if (!auth.currentUser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.authText}>Trebuie să fii logat pentru a adăuga un anunț.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth' as any)}>
          <Text style={styles.loginBtnText}>Mergi la Logare</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="black" />
        <Text style={styles.logoTitle}>PawRadar</Text>
        <Ionicons name="person-circle" size={32} color="#333" />
      </View>

      <View style={styles.content}>
        <Text style={styles.emojiTop}>🐶</Text>

        <Text style={styles.label}>Button</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/report-missing' as any)}>
          <Text style={styles.actionBtnText}>Report a missing pet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/report-found' as any)}>
          <Text style={styles.actionBtnText}>Report a found pet</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomImageContainer}>
          <Text style={styles.emojiBottom}>🐕‍🦺</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  authText: { fontSize: 16, marginBottom: 20 },
  loginBtn: { backgroundColor: '#E57373', padding: 15, borderRadius: 10 },
  loginBtnText: { color: '#FFF', fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  logoTitle: { fontSize: 20, fontWeight: 'bold', color: '#E57373' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  emojiTop: { fontSize: 80, marginBottom: 40 },
  label: { fontSize: 14, color: '#AAA', marginBottom: 10 },
  actionBtn: { backgroundColor: '#F08080', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  bottomImageContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 20 },
  emojiBottom: { fontSize: 120 }
});