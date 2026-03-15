import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useLocation from '../../hooks/useLocation';
import { distanceBetween } from 'geofire-common';
import MatingCard from '../../components/posts/MatingCard';
import { COLORS } from '../../utils/constants';

const LoveRadarScreen = ({ navigation }) => {
  const { location: userLocation } = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: 'all',
    breed: '',
    role: 'all',
    gender: 'all',
    pedigree: null,
    maxDistance: 25,
  });

  const fetchMatingPosts = async () => {
    setLoading(true);
    try {
      let constraints = [
        where('type', '==', 'MATING'),
        where('status', '==', 'ACTIVE'),
        orderBy('createdAt', 'desc')
      ];

      if (filters.species !== 'all') constraints.push(where('matingDetails.species', '==', filters.species));
      if (filters.role !== 'all') constraints.push(where('matingDetails.role', '==', filters.role));
      if (filters.gender !== 'all') constraints.push(where('matingDetails.gender', '==', filters.gender));
      if (filters.pedigree !== null) constraints.push(where('matingDetails.pedigree', '==', filters.pedigree));

      const q = query(collection(db, 'posts'), ...constraints);
      const snap = await getDocs(q);
      let fetchedPosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (userLocation) {
        fetchedPosts = fetchedPosts.filter(p => {
          if (!p.location) return false;
          const dist = distanceBetween(
            [p.location.latitude, p.location.longitude],
            [userLocation.coords.latitude, userLocation.coords.longitude]
          );
          return dist <= filters.maxDistance;
        });
      }

      if (filters.breed) {
        fetchedPosts = fetchedPosts.filter(p =>
          p.matingDetails.breed.toLowerCase().includes(filters.breed.toLowerCase())
        );
      }

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching mating posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatingPosts();
  }, [filters, userLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Love Radar ❤️</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <MatingCard post={item} userLocation={userLocation} navigation={navigation} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No partners match your criteria yet.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 50,
  }
});

export default LoveRadarScreen;
