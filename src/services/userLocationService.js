import { db, auth } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { geohashForPoint } from './geoService';

/** Update current user's last known location in Firestore (for nearby notifications). */
export const updateUserLocationInFirestore = async (lat, lng) => {
  const uid = auth.currentUser?.uid;
  if (!uid || lat == null || lng == null) return;
  const geohash = geohashForPoint([lat, lng]);
  try {
    await updateDoc(doc(db, 'users', uid), {
      lastLocation: { latitude: lat, longitude: lng },
      lastGeohash: geohash,
      lastLocationUpdatedAt: Date.now(),
    });
  } catch (e) {
    console.warn('updateUserLocationInFirestore failed', e);
  }
};
