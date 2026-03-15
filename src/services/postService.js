import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { geohashForLocation } from 'geofire-common';
import { uploadMultiplePhotos, uploadPhoto } from './storageService';
import { getUserIdsInRadius } from './geoService';
import { sendLostAnimalNearbyNotification } from './notificationService';
import { addNotification, NOTIFICATION_TYPES } from './notificationsInAppService';

export const createMissingPost = async (formData, selectedPet, location) => {
  const geohash = geohashForLocation([location.lat, location.lng]);
  const photoURLs = await uploadMultiplePhotos(formData.photos, 'posts');

  const postData = {
    type: 'MISSING',
    status: 'ACTIVE',
    authorId: auth.currentUser.uid,
    petId: selectedPet.id,
    title: `${selectedPet.name} — Missing!`,
    description: formData.description,
    photos: photoURLs,
    location: new GeoPoint(location.lat, location.lng),
    geohash,
    locationName: formData.locationName,
    lastSeenDate: serverTimestamp(),
    reward: formData.reward || 0,
    spottedLocations: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'posts'), postData);
};

export const createFoundPost = async (formData, location, photo) => {
  const photoURL = await uploadPhoto(photo, 'posts/found');
  const lat = location?.lat ?? 45.75;
  const lng = location?.lng ?? 21.23;
  const postRef = await addDoc(collection(db, 'posts'), {
    type: 'FOUND',
    status: 'ACTIVE',
    authorId: auth.currentUser.uid,
    photos: [photoURL],
    location: new GeoPoint(lat, lng),
    geohash: geohashForLocation([lat, lng]),
    description: formData?.description ?? '',
    locationName: formData?.locationName ?? '',
    createdAt: serverTimestamp(),
  });
  return { postId: postRef.id };
};

export const createMatingPost = async (formData, selectedPet, location) => {
  const photoURLs = await uploadMultiplePhotos(formData.photos, 'posts/mating');

  await addDoc(collection(db, 'posts'), {
    type: 'MATING',
    status: 'ACTIVE',
    authorId: auth.currentUser.uid,
    petId: selectedPet.id,
    title: formData.title,
    description: formData.description,
    photos: photoURLs,
    location: new GeoPoint(location.lat, location.lng),
    geohash: geohashForLocation([location.lat, location.lng]),
    locationName: formData.locationName,
    matingDetails: {
      species: selectedPet.species,
      breed: selectedPet.breed,
      gender: selectedPet.gender,
      role: formData.role,
      age: selectedPet.age,
      pedigree: formData.pedigree,
      healthTests: formData.healthTests,
      vaccinated: formData.vaccinated,
      price: formData.price,
      currency: 'RON',
      availableFrom: serverTimestamp(),
      availableTo: serverTimestamp(),
      contactPreference: formData.contactPreference,
    },
    createdAt: serverTimestamp(),
    expiresAt: serverTimestamp(),
  });
};

/** Simple missing post: photo + description + location + locationName. Notifies users within ~500m. */
export const createSimpleMissingPost = async (photoUri, description, location, locationName = '') => {
  const photoURL = await uploadPhoto(photoUri, 'posts');
  const lat = location?.lat ?? 45.75;
  const lng = location?.lng ?? 21.23;
  const geohash = geohashForLocation([lat, lng]);
  const authorId = auth.currentUser.uid;
  const postRef = await addDoc(collection(db, 'posts'), {
    type: 'MISSING',
    status: 'ACTIVE',
    authorId,
    title: 'Missing animal',
    description: description || '',
    photos: [photoURL],
    location: new GeoPoint(lat, lng),
    geohash,
    locationName: locationName || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const postId = postRef.id;
  try {
    const nearbyUsers = await getUserIdsInRadius({ lat, lng }, 0.5);
    const title = 'Animal pierdut în apropiere';
    const body = locationName ? `Raportat în: ${locationName}` : 'Un animal a fost raportat pierdut în zona ta.';
    for (const u of nearbyUsers) {
      if (u.id === authorId) continue;
      await addNotification({
        userId: u.id,
        type: NOTIFICATION_TYPES.LOST_NEARBY,
        title,
        body,
        postId,
        data: { type: 'LOST_NEARBY' },
      });
      await sendLostAnimalNearbyNotification(u.id, locationName || null, postId);
    }
  } catch (e) {
    console.warn('Notify nearby users failed (index or permissions):', e);
  }
};

/** Adoption post: photo + description + location + locationName. */
export const createAdoptionPost = async (photoUri, description, location, locationName = '') => {
  const photoURL = await uploadPhoto(photoUri, 'posts/adoption');
  const lat = location?.lat ?? 45.75;
  const lng = location?.lng ?? 21.23;
  await addDoc(collection(db, 'posts'), {
    type: 'ADOPTION',
    status: 'ACTIVE',
    authorId: auth.currentUser.uid,
    photos: [photoURL],
    description: description || '',
    location: new GeoPoint(lat, lng),
    geohash: geohashForLocation([lat, lng]),
    locationName: locationName || '',
    createdAt: serverTimestamp(),
  });
};

/** Montă simplu: poză + descriere + rasă. */
export const createSimpleMatingPost = async (photoUri, description, breed, location) => {
  const photoURL = await uploadPhoto(photoUri, 'posts/mating');
  const lat = location?.lat ?? 45.75;
  const lng = location?.lng ?? 21.23;
  await addDoc(collection(db, 'posts'), {
    type: 'MATING',
    status: 'ACTIVE',
    authorId: auth.currentUser.uid,
    title: breed ? `Mating – ${breed}` : 'Mating post',
    description: description || '',
    photos: [photoURL],
    location: new GeoPoint(lat, lng),
    geohash: geohashForLocation([lat, lng]),
    matingDetails: {
      breed: breed || '',
      species: 'dog',
      gender: 'male',
      role: 'stud',
      age: 0,
      pedigree: false,
      price: 0,
      currency: 'RON',
    },
    createdAt: serverTimestamp(),
    expiresAt: serverTimestamp(),
  });
};
