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
import { getNotificationsForUser, markNotificationRead, NOTIFICATION_TYPES } from '../../services/notificationsInAppService';
import { COLORS } from '../../utils/constants';

const TYPE_LABELS = {
  [NOTIFICATION_TYPES.LOST]: 'Animal pierdut',
  [NOTIFICATION_TYPES.LOST_NEARBY]: 'Animal pierdut în apropiere',
  [NOTIFICATION_TYPES.FOUND]: 'Animal găsit',
  [NOTIFICATION_TYPES.ADOPTION]: 'Adopție',
  [NOTIFICATION_TYPES.LOVE_MATCH]: 'Love Match',
  [NOTIFICATION_TYPES.CHAT]: 'Mesaj nou',
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!user?.uid) return;
    try {
      const data = await getNotificationsForUser(user.uid);
      setList(data);
    } catch (e) {
      console.warn('Load notifications failed', e);
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

  const onPress = async (item) => {
    if (!item.read) {
      try {
        await markNotificationRead(item.id);
        setList(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
      } catch (e) {}
    }
    if (item.postId) {
      navigation.navigate('PostDetail', { postId: item.postId });
    } else if (item.conversationId) {
      navigation.navigate('Chat', { conversationId: item.conversationId });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.read && styles.itemRead]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.itemType}>{TYPE_LABELS[item.type] || item.type}</Text>
      <Text style={styles.itemTitle}>{item.title}</Text>
      {item.body ? <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text> : null}
    </TouchableOpacity>
  );

  if (loading && list.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificări</Text>
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={list.length === 0 ? styles.empty : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>Nu ai notificări.</Text>}
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
  item: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  itemRead: {
    borderLeftColor: COLORS.textLight,
    opacity: 0.85,
  },
  itemType: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  itemBody: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 16,
  },
});

export default NotificationsScreen;
