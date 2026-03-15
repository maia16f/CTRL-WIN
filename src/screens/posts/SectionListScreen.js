import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import usePosts from '../../hooks/usePosts';
import MissingPostCard from '../../components/posts/MissingPostCard';
import MatingCard from '../../components/posts/MatingCard';
import { COLORS, POST_STATUS } from '../../utils/constants';

const SECTION_TITLES = {
  MISSING: 'Missing Pets',
  FOUND: 'Found Pets',
  ADOPTION: 'Adopt Animals',
};

const SectionListScreen = ({ route, navigation }) => {
  const { sectionType } = route.params || { sectionType: 'MISSING' };
  const { posts, loading, fetchMore } = usePosts(sectionType);
  const visiblePosts = posts.filter(
    (p) => p.status !== POST_STATUS.RESOLVED && p.status !== POST_STATUS.CLOSED
  );

  const renderItem = ({ item }) => {
    const goToDetail = () => navigation.navigate('PostDetail', { post: item });

    if (item.type === 'MISSING') {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={goToDetail}>
          <MissingPostCard post={item} />
        </TouchableOpacity>
      );
    }
    if (item.type === 'FOUND') {
      return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={goToDetail}>
          {item.photos?.[0] ? (
            <Image source={{ uri: item.photos[0] }} style={styles.cardImage} />
          ) : null}
          <Text style={styles.cardTitle}>Found animal</Text>
          {item.locationName ? <Text style={styles.cardLocation}>📍 {item.locationName}</Text> : null}
          <Text style={styles.cardDescription}>{item.description || 'No description.'}</Text>
        </TouchableOpacity>
      );
    }
    if (item.type === 'ADOPTION') {
      return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={goToDetail}>
          {item.photos?.[0] ? (
            <Image source={{ uri: item.photos[0] }} style={styles.cardImage} /> 
          ) : null}
          <Text style={styles.cardTitle}>For adoption</Text>
          {item.locationName ? <Text style={styles.cardLocation}>📍 {item.locationName}</Text> : null}
          <Text style={styles.cardDescription}>{item.description || 'No description.'}</Text>
        </TouchableOpacity>
      );
    }
    if (item.type === 'MATING') {
      return <MatingCard post={item} navigation={navigation} />;
    }
    return null;
  };

  if (!loading && visiblePosts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{SECTION_TITLES[sectionType] || sectionType}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts at the moment.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{SECTION_TITLES[sectionType] || sectionType}</Text>
      {loading && visiblePosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={visiblePosts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={loading ? <ActivityIndicator size="small" color={COLORS.primary} /> : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 15 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  cardImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontWeight: 'bold', marginBottom: 5, color: COLORS.textDark },
  cardLocation: { fontSize: 13, color: COLORS.textLight, marginBottom: 4 },
  cardDescription: { color: COLORS.textLight },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 16,
  },
});

export default SectionListScreen;
