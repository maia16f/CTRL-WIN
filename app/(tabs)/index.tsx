import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function HomeScreen() {
  const router = useRouter();

  const handleChatPress = () => {
    if (auth.currentUser) {
      router.push('/notifications');
    } else {
      router.push('/auth');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchSection}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput style={styles.input} placeholder="Search" />
      </View>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.logoTitle}>PawRadar</Text>
          <Text style={styles.logoSubtitle}>Bringing furry friends back home</Text>
        </View>
        <TouchableOpacity onPress={handleChatPress}>
          <Ionicons name="chatbubble-ellipses" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.bannerContainer}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000' }} style={styles.bannerImage} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Missing Pets</Text>
        <TouchableOpacity style={styles.nextButton}><Ionicons name="chevron-forward" size={16} color="black" /></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={styles.card}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000' }} style={styles.cardImage} />
          <Text style={styles.cardCategory}>Catelus micut</Text>
          <Text style={styles.cardStreet}>Bulevardul Rusca</Text>
          <Text style={styles.cardCity}>Hunedoara</Text>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },
  searchSection: { flexDirection: 'row', backgroundColor: '#F3F3F3', marginHorizontal: 20, borderRadius: 12, alignItems: 'center', paddingHorizontal: 15, height: 50, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#E57373' },
  logoSubtitle: { fontSize: 11, color: '#E57373' },
  bannerContainer: { marginHorizontal: 20, height: 160, borderRadius: 15, overflow: 'hidden', marginBottom: 25 },
  bannerImage: { width: '100%', height: '100%' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#E57373', marginRight: 10 },
  nextButton: { backgroundColor: '#F0F0F0', borderRadius: 10, padding: 2 },
  horizontalScroll: { paddingLeft: 20, marginBottom: 25 },
  card: { width: 150, marginRight: 15 },
  cardImage: { width: 150, height: 150, borderRadius: 12, marginBottom: 8 },
  cardCategory: { fontSize: 12, color: '#999' },
  cardStreet: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  cardCity: { fontSize: 14, color: '#333' },
});