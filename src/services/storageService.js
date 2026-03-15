import * as ImagePicker from 'expo-image-picker';

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
  data.append('file', {
    uri: localUri,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`,
  });
  
  data.append('upload_preset', UPLOAD_PRESET);
  
  // Cloudinary poate organiza pozele în foldere folosind 'folder'
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
      throw new Error(result.error.message);
    }
    
    return result.secure_url; // Returnează URL-ul public al imaginii
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

export const uploadMultiplePhotos = async (localUris, path) => {
  if (!localUris || localUris.length === 0) return [];
  return Promise.all(localUris.map(uri => uploadPhoto(uri, path)));
};
