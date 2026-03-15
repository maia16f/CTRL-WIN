import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { COLORS, POST_TYPES } from '../../utils/constants';
import { pickImage } from '../../services/storageService';
import {
  createSimpleMissingPost,
  createFoundPost,
  createAdoptionPost,
} from '../../services/postService';

const SCREEN_TITLES = {
  [POST_TYPES.MISSING]: 'Lost Animals',
  [POST_TYPES.FOUND]: 'Found Animals',
  [POST_TYPES.ADOPTION]: 'Adopt Animals',
};

const LOCATION_LABELS = {
  [POST_TYPES.MISSING]: 'Where was the animal lost? (street, area, city)',
  [POST_TYPES.FOUND]: 'Where was the animal found? (street, area, city)',
  [POST_TYPES.ADOPTION]: 'Location (city or area)',
};

const CreatePostScreen = ({ route, navigation }) => {
  const { postType } = route.params || {};
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCoords, setManualCoords] = useState(null);

  useEffect(() => {
    const title = SCREEN_TITLES[postType] || 'Create post';
    navigation.setOptions({ title });
  }, [postType, navigation]);

  const handlePickImage = async () => {
    try {
      const uri = await pickImage();
      if (uri) setPhotoUri(uri);
    } catch (err) {
      Alert.alert('Photo error', err.message || 'Could not pick image. Please try again.');
    }
  };

  const getCurrentCoords = async () => {
    if (Platform.OS === 'web') return { lat: 44.4268, lng: 26.1025 };
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { lat: loc.coords.latitude, lng: loc.coords.longitude };
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!photoUri) {
      Alert.alert('Photo required', 'Please add a photo.');
      return;
    }
    setLoading(true);
    try {
      const baseCoords = await getCurrentCoords();
      const latLng = manualCoords || baseCoords || { lat: 45.75, lng: 21.23 };

      if (postType === POST_TYPES.MISSING) {
        await createSimpleMissingPost(photoUri, description, latLng, locationName);
        Alert.alert('Success', 'Animal pierdut a fost publicat. Apare pe hartă și în secțiunea Missing Pets.');
      } else if (postType === POST_TYPES.FOUND) {
        await createFoundPost({ description, locationName }, latLng, photoUri);
        Alert.alert('Success', 'Animal găsit a fost publicat. Apare pe hartă și în secțiunea Found Pets.');
      } else if (postType === POST_TYPES.ADOPTION) {
        await createAdoptionPost(photoUri, description, latLng, locationName);
        Alert.alert('Success', 'Anunțul de adopție a fost publicat.');
      } else {
        Alert.alert('Error', 'Unknown post type.');
        setLoading(false);
        return;
      }
      navigation.goBack();
    } catch (err) {
      const msg = err.message || 'Could not publish the post.';
      Alert.alert('Eroare', msg.includes('Upload') ? 'Încărcarea imaginii a eșuat. Verifică conexiunea și încearcă din nou.' : msg);
    } finally {
      setLoading(false);
    }
  };

  const title = SCREEN_TITLES[postType] || 'Create post';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.imagePickerText}>Add photo</Text>
        )}
      </TouchableOpacity>

      {postType !== POST_TYPES.ADOPTION && (
        <>
          <Text style={styles.locationHint}>
            Poți alege manual locul pe hartă sau folosim poziția ta curentă.
          </Text>
          <TouchableOpacity
            style={styles.pickLocationButton}
            onPress={() => {
              navigation.navigate('PickLocation', {
                initialCoords: manualCoords,
                onLocationPicked: async (coords) => {
                  setManualCoords(coords);
                  // încearcă să obții automat un nume de zonă / oraș
                  if (Platform.OS !== 'web') {
                    try {
                      const places = await Location.reverseGeocodeAsync({
                        latitude: coords.lat,
                        longitude: coords.lng,
                      });
                      if (places && places[0]) {
                        const p = places[0];
                        const label = [p.street, p.subregion || p.city, p.country]
                          .filter(Boolean)
                          .join(', ');
                        if (label) {
                          setLocationName(label);
                        }
                      }
                    } catch {
                      // ignorăm dacă reverse geocode eșuează
                    }
                  }
                },
              });
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.pickLocationText}>
              {manualCoords
                ? `Locație selectată pe hartă ✅ (${manualCoords.lat.toFixed(4)}, ${manualCoords.lng.toFixed(4)})`
                : 'Alege pe hartă locul unde s-a pierdut / găsit'}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={styles.label}>{LOCATION_LABELS[postType] || 'Location'}</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Central Park, Main Street, Timișoara"
        value={locationName}
        onChangeText={setLocationName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Description..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.submitText}>Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  imagePicker: {
    height: 220,
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePickerText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 16,
  },
  locationHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  pickLocationButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  pickLocationText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePostScreen;
