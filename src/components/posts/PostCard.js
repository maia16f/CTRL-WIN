import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Avatar from '../common/Avatar';

const PostCard = ({ post }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar source={{ uri: post.author.avatar }} />
        <Text style={styles.authorName}>{post.author.name}</Text>
      </View>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorName: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  content: {},
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {},
});

export default PostCard;
