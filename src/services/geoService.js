import { geohashQueryBounds, distanceBetween } from 'geofire-common';
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
