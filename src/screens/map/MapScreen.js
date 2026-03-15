import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, Platform } from 'react-native';
import { MapView } from '../../components/map/MapWrapper';
import * as Location from 'expo-location';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PostMarker from '../../components/map/PostMarker';
import { COLORS } from '../../utils/constants';

const MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        // Mock location for web to avoid permission crashes
        setLocation({
          latitude: 44.4268,
          longitude: 26.1025,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setLoading(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisiune necesară', 'Activează locația pentru a vedea anunțurile din zona ta.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      fetchPosts();
    })();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        where('status', '==', 'ACTIVE')
      );
      const snap = await getDocs(q);
      const fetchedPosts = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => post.location); // Asigură-te că are locație
      
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching map posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  if (!location) {
    return <View style={styles.centered}><Text>Se încarcă harta...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {Platform.OS !== 'web' && posts.map(post => (
          <PostMarker key={post.id} post={post} onPress={() => handleMarkerPress(post)} />
        ))}
      </MapView>
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
    backgroundColor: COLORS.background
  }
});

export default MapScreen;
