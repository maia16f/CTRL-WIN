import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, Day, InputToolbar } from 'react-native-gifted-chat';
import useChat from '../../hooks/useChat';
import { sendMessage } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/constants';

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
    if (!newMessages.length) return;
    const text = newMessages[0].text?.trim();
    if (!text) return;
    // Afișează imediat mesajul în UI
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    // Trimite către backend
    sendMessage(conversationId, text);
  }, [conversationId]);

  if (!user) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#E57373" /></View>;

  return (
    <GiftedChat
      messages={messages}
      onSend={msgs => onSend(msgs)}
      user={{
        _id: user.uid,
      }}
      placeholder="Type a message..."
      renderAvatar={null}
      bottomOffset={16}
      renderDay={(props) => (
        <Day
          {...props}
          textStyle={{ color: COLORS.textLight, fontSize: 11 }}
        />
      )}
      renderBubble={(props) => (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: COLORS.primary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 18,
              marginBottom: 2,
            },
            left: {
              backgroundColor: '#F0F0F0',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 18,
              marginBottom: 2,
            },
          }}
          textStyle={{
            right: { color: COLORS.white },
            left: { color: COLORS.textDark },
          }}
        />
      )}
      renderInputToolbar={(props) => (
        <InputToolbar
          {...props}
          containerStyle={{
            marginHorizontal: 8,
            marginBottom: 12,
            borderRadius: 20,
            borderTopWidth: 0,
            backgroundColor: COLORS.white,
            paddingHorizontal: 4,
            elevation: 2,
          }}
        />
      )}
    />
  );
};

export default ChatScreen;
