import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

// Aici vei pune datele tale de la Cloudinary
const CLOUD_NAME = 'dvp1n047j'; // Înlocuiește cu Cloud Name-ul tău
const UPLOAD_PRESET = 'pawradar_poze'; // Înlocuiește cu numele preset-ului Unsigned

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
    aspect: [4, 3]
  });

  return result.canceled ? null : result.assets[0].uri;
};

export const uploadPhoto = async (localUri, path) => {
  if (!localUri) return null;

  const data = new FormData();

  if (Platform.OS === 'web') {
    // Pe web folosim blob + File, cum cere fetch + Cloudinary
    try {
      const resp = await fetch(localUri);
      const blob = await resp.blob();
      const file = new File([blob], `upload_${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
      data.append('file', file);
    } catch (e) {
      console.warn('Fetch blob for upload failed, trying fallback as uri:', e);
      data.append('file', {
        uri: localUri,
        type: 'image/jpeg',
        name: `upload_${Date.now()}.jpg`,
      });
    }
  } else {
    // iOS / Android – varianta clasică, stabilă
    data.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    });
  }

  data.append('upload_preset', UPLOAD_PRESET);
  if (path) {
    data.append('folder', `pawradar/${path}`);
  }

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error.message || 'Upload failed');
    }
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

export const uploadMultiplePhotos = async (localUris, path) => {
  if (!localUris || localUris.length === 0) return [];
  return Promise.all(localUris.map(uri => uploadPhoto(uri, path)));
};
