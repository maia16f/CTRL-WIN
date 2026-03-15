import { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      setMessages([]);
      return;
    }

    setLoading(true);
    const msgRef = ref(rtdb, `messages/${conversationId}`);
    const unsubscribe = onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMessages([]);
      } else {
        const msgs = Object.entries(data)
          .map(([id, msg]) => ({ _id: id, ...msg }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setMessages(msgs);
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  return { messages, loading };
};

export default useChat;
