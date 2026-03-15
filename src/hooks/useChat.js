import { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversationId) return;

    const msgRef = ref(rtdb, `messages/${conversationId}`);
    const unsubscribe = onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data)
          .map(([id, msg]) => ({ _id: id, ...msg }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setMessages(msgs);
      }
    });

    return () => off(msgRef, 'value', unsubscribe);
  }, [conversationId]);

  return { messages };
};

export default useChat;
