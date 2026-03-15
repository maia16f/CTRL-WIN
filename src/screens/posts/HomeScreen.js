import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/constants';
import usePosts from '../../hooks/usePosts';
import PostCard from '../../components/posts/PostCard';
import MissingPostCard from '../../components/posts/MissingPostCard';

const HomeScreen = () => {
  const { posts, loading, fetchMore } = usePosts(['SOCIAL', 'ADOPTION', 'MISSING']);

  const renderItem = ({ item }) => {
    if (item.type === 'MISSING') {
      return <MissingPostCard post={item} />;
    }
    return <PostCard post={item} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      {loading && posts.length === 0 ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="small" color={COLORS.primary} /> : null}
          ListEmptyComponent={<Text style={styles.emptyText}>Nu există postări momentan.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 50,
  }
});

export default HomeScreen;
