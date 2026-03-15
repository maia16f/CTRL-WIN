import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import useChat from '../../hooks/useChat';
import { sendMessage } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const ChatScreen = ({ route }) => {
  const { conversationId } = route.params || {};
  const { messages: rtdbMessages } = useChat(conversationId);
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (rtdbMessages) {
      const formattedMessages = rtdbMessages.map(m => ({
        _id: m._id,
        text: m.content,
        createdAt: new Date(m.timestamp),
        user: {
          _id: m.senderId,
        },
      }));
      setMessages(formattedMessages);
    }
  }, [rtdbMessages]);

  const onSend = useCallback((newMessages = []) => {
    const text = newMessages[0].text;
    sendMessage(conversationId, text);
  }, [conversationId]);

  if (!user) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#E57373" /></View>;

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: user.uid,
      }}
      placeholder="Scrie un mesaj..."
      renderAvatar={null}
    />
  );
};

export default ChatScreen;
