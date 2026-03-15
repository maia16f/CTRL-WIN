import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Animated, PanResponder, Dimensions, Alert } from 'react-native';
import { collection, query, where, getDocs, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import useLocation from '../../hooks/useLocation';
import { distanceBetween } from 'geofire-common';
import { COLORS } from '../../utils/constants';
import { getOrCreateConversation } from '../../services/chatService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;

const LoveRadarScreen = ({ navigation }) => {
  const { location: userLocation } = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const fetchMatingPosts = async () => {
    // ... (fetch logic remains the same)
  };

  useEffect(() => {
    fetchMatingPosts();
  }, [userLocation]);

  const handleSwipe = async (direction) => {
    const post = posts[currentIndex];
    const myId = auth.currentUser?.uid;
    if (!post || !myId) return;

    const swipeData = {
      swiperId: myId,
      targetPostId: post.id,
      targetUserId: post.authorId,
      type: direction,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'swipes', `${myId}_${post.id}`), swipeData);

    if (direction === 'like') {
      const otherSwipeRef = doc(db, 'swipes', `${post.authorId}_${myId}`); // This check is simplified
      const otherSwipeSnap = await getDoc(otherSwipeRef);

      if (otherSwipeSnap.exists() && otherSwipeSnap.data().type === 'like') {
        // It's a match!
        Alert.alert(
          'It\'s a Match!',
          `You and ${post.authorName || 'the owner'} both liked each other.`,
          [
            { text: 'Keep Swiping', style: 'cancel' },
            {
              text: 'Send a Message',
              onPress: async () => {
                const conversationId = await getOrCreateConversation(post.authorId);
                if (conversationId) {
                  navigation.navigate('Chat', { conversationId });
                }
              },
            },
          ]
        );
      }
    }

    // Move to next card
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(prev => prev + 1);
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (evt, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        // Swipe Right
        handleSwipe('like');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        // Swipe Left
        handleSwipe('pass');
      } else {
        // Reset position
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  }), [currentIndex, posts]);

  const renderCard = (post, index) => {
    if (index < currentIndex) return null;
    if (index > currentIndex) return null;

    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    const cardStyle = {
      transform: [{ rotate }, ...position.getTranslateTransform()],
    };

    return (
      <Animated.View {...panResponder.panHandlers} style={[styles.card, cardStyle]}>
        {post.photos?.[0] ? (
          <Image source={{ uri: post.photos[0] }} style={styles.cardImage} />
        ) : null}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{post.matingDetails?.breed || 'Lovely pet'}</Text>
          {post.locationName && <Text style={styles.cardLocation}>📍 {post.locationName}</Text>}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : posts.length > 0 && currentIndex < posts.length ? (
        posts.map(renderCard).reverse()
      ) : (
        <Text style={styles.emptyText}>No more profiles.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.9,
        height: '75%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    cardImage: {
        width: '100%',
        height: '80%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    cardBody: {
        padding: 14,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    cardLocation: {
        fontSize: 13,
        color: COLORS.textLight,
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        fontSize: 16,
    },
});

export default LoveRadarScreen;
