import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getOrCreateConversation } from '../../services/chatService';
import { sendSpottedNotification } from '../../services/notificationService';
import { COLORS, POST_STATUS } from '../../utils/constants';

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { post: routePost, postId } = route.params || {};
  const [post, setPost] = useState(routePost || null);
  const [loading, setLoading] = useState(!routePost && !!postId);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (routePost) {
      setPost(routePost);
      return;
    }
    if (!postId) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'posts', postId));
        if (snap.exists()) setPost({ id: snap.id, ...snap.data() });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [routePost, postId]);

  const handleMessage = async () => {
    if (!post?.authorId) return;
    try {
      const conversationId = await getOrCreateConversation(post.authorId, post.id);
      if (conversationId) navigation.navigate('Chat', { conversationId });
    } catch (e) {
      console.warn(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>Post negăsit.</Text>
      </View>
    );
  }

  const photoUri = post.photos?.[0] || post.pet?.photoURL;
  const canMessage = post.authorId && ['MISSING', 'FOUND', 'ADOPTION'].includes(post.type);
  const isFound = post.type === 'FOUND';
  const isAdoption = post.type === 'ADOPTION';
  const isAuthor = user?.uid && post.authorId === user.uid;
  const canClose = isAuthor && post.status !== POST_STATUS.CLOSED && post.status !== POST_STATUS.RESOLVED;

  const handleClosePost = async () => {
    if (!post?.id && !postId) return;
    Alert.alert(
      'Închide și șterge anunțul',
      'Ești sigură că ai găsit animalul? Anunțul va fi marcat ca rezolvat și șters din listă.',
      [
        { text: 'Nu', style: 'cancel' },
        {
          text: 'Da, am găsit animalul',
          style: 'destructive',
          onPress: async () => {
            setClosing(true);
            try {
              const id = post.id || postId;
              // marchează ca RESOLVED pentru istoric, apoi șterge documentul
              await updateDoc(doc(db, 'posts', id), { status: POST_STATUS.RESOLVED });
              await deleteDoc(doc(db, 'posts', id));
              navigation.goBack();
            } catch (e) {
              console.warn('close/delete post failed', e);
              setClosing(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title}>{post.title || (post.type === 'MISSING' ? 'Animal pierdut' : post.type === 'FOUND' ? 'Animal găsit' : 'Pentru adopție')}</Text>
        {post.locationName ? <Text style={styles.location}>📍 {post.locationName}</Text> : null}
        {post.description ? <Text style={styles.description}>{post.description}</Text> : null}
        {canMessage && (
          <TouchableOpacity
            style={[styles.messageButton, isFound && styles.foundButton]}
            onPress={async () => {
              await handleMessage();
              if (isFound) {
                try {
                  await sendSpottedNotification(
                    post.authorId,
                    post.title || 'Your pet',
                    post.locationName || '',
                    post.id
                  );
                } catch (e) {
                  console.warn('sendSpottedNotification failed', e);
                }
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.messageButtonText}>
              {isFound ? 'Cred că este animalul meu' : 'Trimite mesaj'}
            </Text>
          </TouchableOpacity>
        )}
        {canClose && (
          <TouchableOpacity
            style={[styles.messageButton, styles.closeButton]}
            onPress={handleClosePost}
            activeOpacity={0.8}
            disabled={closing}
          >
            <Text style={styles.messageButtonText}>
              {closing
                ? 'Se închide...'
                : isAdoption
                ? 'Șterge anunțul de adopție'
                : 'Am găsit animalul, închide anunțul'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  empty: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#eee',
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
    marginBottom: 20,
  },
  messageButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 8,
  },
  messageButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  foundButton: {
    backgroundColor: COLORS.success,
  },
  closeButton: {
    backgroundColor: COLORS.danger,
    marginTop: 4,
  },
});

export default PostDetailScreen;
