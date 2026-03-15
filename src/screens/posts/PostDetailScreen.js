import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostDetailScreen = ({ route }) => {
  const { post } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detaliu Anunț</Text>
      {post && <Text>{post.title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E57373',
  },
});

export default PostDetailScreen;
