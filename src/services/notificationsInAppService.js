import { db } from '../config/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, limit, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export const NOTIFICATION_TYPES = {
  LOST: 'LOST',
  FOUND: 'FOUND',
  ADOPTION: 'ADOPTION',
  LOVE_MATCH: 'LOVE_MATCH',
  CHAT: 'CHAT',
  LOST_NEARBY: 'LOST_NEARBY',
};

/** Add an in-app notification for a user. */
export const addNotification = async ({ userId, type, title, body, postId = null, conversationId = null, data = {} }) => {
  await addDoc(collection(db, 'notifications'), {
    userId,
    type,
    title,
    body,
    postId: postId || null,
    conversationId: conversationId || null,
    data,
    read: false,
    createdAt: serverTimestamp(),
  });
};

/** Get notifications for the current user, newest first. */
export const getNotificationsForUser = async (uid, max = 50) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/** Mark notification as read. */
export const markNotificationRead = async (notificationId) => {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
};
