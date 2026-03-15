import { rtdb, auth } from '../config/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';

export const sendMessage = async (conversationId, content, type = 'text', imageURL = null) => {
  const senderId = auth.currentUser.uid;
  const msgRef = ref(rtdb, `messages/${conversationId}`);
  const newMsgRef = push(msgRef);

  await set(newMsgRef, {
    senderId,
    content,
    type,
    imageURL,
    timestamp: Date.now(),
    isRead: false,
  });

  const convRef = ref(rtdb, `conversations/${conversationId}`);
  await set(ref(rtdb, `conversations/${conversationId}/lastMessage`), content);
  await set(ref(rtdb, `conversations/${conversationId}/lastMessageTimestamp`), Date.now());
};
