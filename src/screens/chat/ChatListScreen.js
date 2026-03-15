import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getConversationsForUser } from '../../services/chatService';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { COLORS } from '../../utils/constants';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!user?.uid) return;
    try {
      const convos = await getConversationsForUser(user.uid);
      const withNames = await Promise.all(
        convos.map(async (c) => {
          const otherId = c.participants.find((p) => p !== user.uid);
          let otherName = 'Utilizator';
          if (otherId) {
            try {
              const snap = await getDoc(doc(db, 'users', otherId));
              if (snap.exists()) otherName = snap.data().displayName || otherName;
            } catch (e) {}
          }
          return { ...c, otherUserId: otherId, otherName };
        })
      );
      setList(withNames);
    } catch (e) {
      console.warn('Load conversations failed', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const onPress = (item) => {
    navigation.navigate('Chat', { conversationId: item.id });
  };

  if (loading && list.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mesaje</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.otherName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{item.otherName}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.lastMessage || 'Fără mesaje'}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={list.length === 0 ? styles.empty : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>Nu ai conversații încă.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  body: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  preview: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  empty: { flex: 1, justifyContent: 'center', paddingTop: 60 },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 16,
  },
});

export default ChatListScreen;
