import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ReportFoundScreen() {
  const router = useRouter();
  const [inPossession, setInPossession] = useState(true);

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

        <Text style={styles.mainTitle}>Have you found a pet? Let's help him reunite with his owner!</Text>
        <Text style={styles.pillsLabel}>Pills</Text>

        <View style={styles.pill}><Text style={styles.pillText}>Pet's photo:</Text></View>
        <TextInput style={styles.input} placeholder="Upload pet photo" />

        <View style={styles.pill}><Text style={styles.pillText}>Found him at:</Text></View>
        <TextInput style={styles.input} placeholder="Enter location" />

        <View style={styles.pill}><Text style={styles.pillText}>Pet's state</Text></View>
        
        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxText}>In my possesion</Text>
          <TouchableOpacity onPress={() => setInPossession(true)}>
            <Ionicons name={inPossession ? "checkbox" : "square-outline"} size={24} color="#673AB7" />
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxText}>Not in my possesion</Text>
          <TouchableOpacity onPress={() => setInPossession(false)}>
            {/* Aici am corectat iconita in close-circle */}
            <Ionicons name={!inPossession ? "close-circle" : "square-outline"} size={24} color="#E53935" />
          </TouchableOpacity>
        </View>

        <View style={styles.pill}><Text style={styles.pillText}>Last seen at:</Text></View>
        <Text style={styles.subLabel}>(if not in my possesion)</Text>
        <TextInput style={styles.input} placeholder="Enter location" editable={!inPossession} />

        <View style={styles.bottomIcon}>
           <Text style={{ fontSize: 80 }}>🐱</Text>
        </View>
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
  input: { borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 10, fontSize: 16, color: '#888', marginBottom: 10 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxText: { fontSize: 16, color: '#888', width: 150 },
  subLabel: { color: '#888', fontSize: 14, marginBottom: 5 },
  bottomIcon: { alignItems: 'flex-end', marginTop: 20 }
});