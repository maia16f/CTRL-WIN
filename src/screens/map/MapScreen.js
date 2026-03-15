import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, Platform, TouchableOpacity } from 'react-native';
import { MapView } from '../../components/map/MapWrapper';
import * as Location from 'expo-location';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PostMarker from '../../components/map/PostMarker';
import { updateUserLocationInFirestore } from '../../services/userLocationService';
import { COLORS } from '../../utils/constants';

const FILTER_OPTIONS = [
  { key: 'all', label: 'Both' },
  { key: 'MISSING', label: 'Missing only' },
  { key: 'FOUND', label: 'Found only' },
];

const MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        const region = { latitude: 44.4268, longitude: 26.1025, latitudeDelta: 0.05, longitudeDelta: 0.05 };
        setLocation(region);
        updateUserLocationInFirestore(region.latitude, region.longitude).catch(() => {});
        setLoading(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      let region;
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        region = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
      } else {
        Alert.alert('Permission', 'Vom folosi o locație implicită pentru hartă (poți activa GPS mai târziu).');
        region = {
          latitude: 44.4268,
          longitude: 26.1025,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
      }
      setLocation(region);
      updateUserLocationInFirestore(region.latitude, region.longitude).catch(() => {});
      fetchPosts();
    })();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        where('type', 'in', ['MISSING', 'FOUND'])
      );
      const snap = await getDocs(q);
      const fetchedPosts = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => post.location && (post.type === 'MISSING' || post.type === 'FOUND') && (post.status !== 'CLOSED'));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching map posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.type === filter);

  const handleMarkerPress = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  if (!location) {
    return <View style={styles.centered}><Text>Loading map...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {Platform.OS !== 'web' && filteredPosts.map(post => (
          <PostMarker key={post.id} post={post} onPress={() => handleMarkerPress(post)} />
        ))}
      </MapView>

      <View style={styles.filterContainer}>
        <View style={styles.legend}>
          <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#E53935' }]} /><Text style={styles.legendText}>Missing</Text></View>
          <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#43A047' }]} /><Text style={styles.legendText}>Found</Text></View>
        </View>
        <View style={styles.filterRow}>
          {FILTER_OPTIONS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterBtn, filter === key && styles.filterBtnActive]}
              onPress={() => setFilter(key)}
            >
              <Text style={[styles.filterBtnText, filter === key && styles.filterBtnTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  legend: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  filterBtnTextActive: {
    color: COLORS.white,
  },
});

export default MapScreen;
