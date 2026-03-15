import { geohashQueryBounds, distanceBetween, geohashForLocation } from 'geofire-common';
import { collection, query, where, orderBy, startAt, endAt, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const fetchMissingInRadius = async (center, radiusKm) => {
  const bounds = geohashQueryBounds([center.lat, center.lng], radiusKm * 1000);
  const promises = bounds.map(b =>
    getDocs(query(
      collection(db, 'posts'),
      where('type', '==', 'MISSING'),
      where('status', '==', 'ACTIVE'),
      orderBy('geohash'),
      startAt(b[0]), endAt(b[1])
    ))
  );

  const snapshots = await Promise.all(promises);
  return snapshots.flatMap(s => s.docs).map(doc => ({ id: doc.id, ...doc.data() })).filter(post => {
    if (!post.location) return false;
    const { latitude, longitude } = post.location;
    return distanceBetween([latitude, longitude], [center.lat, center.lng]) <= radiusKm;
  });
};

const RADIUS_500M_KM = 0.5;

/** Get user IDs (and optional fcmToken) within radiusKm of center. Users must have lastGeohash in Firestore. */
export const getUserIdsInRadius = async (center, radiusKm = RADIUS_500M_KM) => {
  const bounds = geohashQueryBounds([center.lat, center.lng], radiusKm * 1000);
  const promises = bounds.map(b =>
    getDocs(query(
      collection(db, 'users'),
      orderBy('lastGeohash'),
      startAt(b[0]),
      endAt(b[1])
    ))
  );
  const snapshots = await Promise.all(promises);
  const users = snapshots.flatMap(s => s.docs).map(d => ({ id: d.id, ...d.data() }));
  return users.filter(u => {
    if (!u.lastLocation?.latitude) return false;
    const dist = distanceBetween([u.lastLocation.latitude, u.lastLocation.longitude], [center.lat, center.lng]);
    return dist <= radiusKm;
  });
};

// Wrapper pentru a păstra numele vechi geohashForPoint, dar folosind API-ul corect din geofire-common
export const geohashForPoint = (coords) => geohashForLocation(coords);

export { geohashForLocation };
