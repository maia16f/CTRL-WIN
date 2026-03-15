import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { pickImage } from '../../services/storageService';
import useLocation from '../../hooks/useLocation';
import { createSimpleMatingPost } from '../../services/postService';

const CreateMatingPostScreen = ({ navigation }) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [description, setDescription] = useState('');
  const [breed, setBreed] = useState('');
  const [loading, setLoading] = useState(false);
  const { location } = useLocation();

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setPhotoUri(uri);
  };

  const handleCreate = async () => {
    if (!photoUri) {
      Alert.alert('Photo required', 'Please add a photo.');
      return;
    }
    setLoading(true);
    try {
      const coords = location?.coords
        ? { lat: location.coords.latitude, lng: location.coords.longitude }
        : null;
      await createSimpleMatingPost(photoUri, description, breed, coords);
      Alert.alert('Success', 'Mating post has been published.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not publish the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Love Radar – Mating post</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.imagePickerText}>Add photo</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Breed</Text>
      <TextInput
        style={styles.input}
        placeholder="ex. Golden Retriever, Maine Coon..."
        value={breed}
        onChangeText={setBreed}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description, preferences, details..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
  imagePicker: {
    height: 220,
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePickerText: { color: COLORS.textLight, fontWeight: '600', fontSize: 16 },
  input: { backgroundColor: COLORS.white, padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});

export default CreateMatingPostScreen;
