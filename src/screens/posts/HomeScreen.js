import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, POST_STATUS } from '../../utils/constants';
import usePosts from '../../hooks/usePosts';
import MissingPostCard from '../../components/posts/MissingPostCard';
import MatingCard from '../../components/posts/MatingCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.55;
const CARD_MARGIN = 10;

const SECTION_CONFIG = [
  { type: 'MISSING', title: 'Missing Pets' },
  { type: 'FOUND', title: 'Found Pets' },
  { type: 'ADOPTION', title: 'Adopt Animals' },
];

const HomeScreen = ({ navigation }) => {
  const { posts, loading } = usePosts(['MISSING', 'FOUND', 'ADOPTION']);

  const missingPosts = posts.filter((p) => p.type === 'MISSING' && p.status !== POST_STATUS.RESOLVED && p.status !== POST_STATUS.CLOSED);
  const foundPosts = posts.filter((p) => p.type === 'FOUND' && p.status !== POST_STATUS.RESOLVED && p.status !== POST_STATUS.CLOSED);
  const adoptionPosts = posts.filter((p) => p.type === 'ADOPTION' && p.status !== POST_STATUS.RESOLVED && p.status !== POST_STATUS.CLOSED);

  const renderSmallCard = (item, type) => {
    const uri = item.photos?.[0] || item.pet?.photoURL || 'https://via.placeholder.com/300';
    const title = item.title || (type === 'FOUND' ? 'Found animal' : type === 'ADOPTION' ? 'For adoption' : 'Missing animal');
    const subtitle = item.locationName || item.description?.slice(0, 40) || '';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.smallCard}
        onPress={() => navigation.navigate('PostDetail', { post: item })}
        activeOpacity={0.9}
      >
        <Image source={{ uri }} style={styles.smallCardImage} />
        <Text style={styles.smallCardName} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.smallCardLocation} numberOfLines={1}>{subtitle}</Text> : null}
      </TouchableOpacity>
    );
  };

  const renderSection = (sectionType, sectionTitle, data) => (
    <View style={styles.section} key={sectionType}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SectionList', { sectionType, sectionTitle })}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.moreText}>more</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {data.length === 0 ? (
          <Text style={styles.noItems}>No posts at the moment.</Text>
        ) : (
          data.slice(0, 10).map((item) => renderSmallCard(item, sectionType))
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title above hero image */}
        <View style={styles.heroHeader}>
          <Text style={styles.appName}>PawRadar</Text>
          <Text style={styles.tagline}>Bringing furry friends back home</Text>
        </View>
        {/* Hero image - puppy with paw treat */}
        <View style={styles.bannerWrap}>
          <Image
            source={require('../../../assets/hero.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Sections: Missing Pets, Found Pets, Adopt Animals */}
        {SECTION_CONFIG.map(({ type, title }) => {
          const data = type === 'MISSING' ? missingPosts : type === 'FOUND' ? foundPosts : adoptionPosts;
          return renderSection(type, title, data);
        })}

        {loading && posts.length === 0 ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 24 }} />
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  heroHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  bannerWrap: {
    width: '100%',
    height: 220,
    backgroundColor: COLORS.secondary,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  moreText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  smallCard: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  smallCardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#eee',
  },
  smallCardName: {
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  smallCardLocation: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  noItems: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
