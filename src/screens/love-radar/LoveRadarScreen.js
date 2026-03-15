import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useLocation from '../../hooks/useLocation';
import { distanceBetween } from 'geofire-common';
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
      // toate animalele disponibile pentru împerechere
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
      {/* Hero image sus cu cei doi căței */}
      <Image source={require('../../../assets/love-hero.png')} style={styles.heroImage} />

      {/* Text de intro */}
      <View style={styles.textBlock}>
        <Text style={styles.mainTitle}>Your pet needs love too! ❤️</Text>
        <Text style={styles.subtitle}>Swipe left for NO and right for YES.</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No partners match your criteria yet.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('MatingDetail', { post: item })}
              >
                {item.photos?.[0] ? (
                  <Image source={{ uri: item.photos[0] }} style={styles.cardImage} />
                ) : null}
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>
                    {item.matingDetails?.breed || 'Lovely pet'}
                  </Text>
                  {item.locationName ? (
                    <Text style={styles.cardLocation}>📍 {item.locationName}</Text>
                  ) : null}
                  {item.description ? (
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 10,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  textBlock: {
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 260,
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoveRadarScreen;
