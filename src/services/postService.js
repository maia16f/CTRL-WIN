import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { geohashForPoint } from 'geofire-common';
import { uploadMultiplePhotos } from './storageService';

export const createMissingPost = async (formData, selectedPet, location) => {
  const geohash = geohashForPoint([location.lat, location.lng]);
  const photoURLs = await uploadMultiplePhotos(formData.photos, 'posts');

  const postData = {
    type: 'MISSING',
    status: 'ACTIVE',
    authorId: auth.currentUser.uid,
    petId: selectedPet.id,
    title: `${selectedPet.name} — Disparut/ă!`,
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

  const postRef = await addDoc(collection(db, 'posts'), {
    type: 'FOUND',
    status: 'ACTIVE',
    authorId: auth.currentUser.uid,
    photos: [photoURL],
    location: new GeoPoint(location.lat, location.lng),
    geohash: geohashForPoint([location.lat, location.lng]),
    description: formData.description,
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
    geohash: geohashForPoint([location.lat, location.lng]),
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
