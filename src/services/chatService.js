import { rtdb, auth, db } from '../config/firebase';
import { ref, push, set } from 'firebase/database';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, orderBy, getDocs, limit, addDoc } from 'firebase/firestore';

const conversationIdFromUsers = (uid1, uid2) => [uid1, uid2].sort().join('_');

/** Get or create a 1:1 conversation; returns conversationId (used for RTDB and Firestore doc id). */
export const getOrCreateConversation = async (otherUserId, postId = null) => {
  const myId = auth.currentUser?.uid;
  if (!myId || !otherUserId) return null;
  const id = conversationIdFromUsers(myId, otherUserId);
  const convRef = doc(db, 'conversations', id);
  const snap = await getDoc(convRef);
  if (snap.exists()) {
    if (postId && !snap.data().postId) {
      await updateDoc(convRef, { postId });
    }
    return id;
  }
  await setDoc(convRef, {
    participants: [myId, otherUserId],
    postId: postId || null,
    lastMessage: '',
    lastMessageAt: 0,
    createdAt: Date.now(),
  });
  return id;
};

export const sendMessage = async (conversationId, content, type = 'text', imageURL = null) => {
  if (!auth.currentUser || !conversationId) {
    console.error("User not authenticated or no conversation ID provided.");
    return;
  }
  const senderId = auth.currentUser.uid;
  const msgRef = ref(rtdb, `messages/${conversationId}`);
  const newMsgRef = push(msgRef);
  const now = Date.now();

  await set(newMsgRef, {
    senderId,
    content,
    type,
    imageURL,
    timestamp: now,
    isRead: false,
  });

  try {
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: content,
      lastMessageAt: now,
    });
    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
      senderId,
      content,
      type,
      imageURL,
      timestamp: now,
      isRead: false,
    });
  } catch (e) {
    console.warn('Update Firestore conversation failed', e);
  }
};

/** List conversations for current user (for ChatList). */
export const getConversationsForUser = async (uid, max = 50) => {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid),
    limit(max)
  );
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return items.sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));
};
