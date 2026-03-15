import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Badge from '../common/Badge';

const MissingPostCard = ({ post }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: post.pet.photoURL }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
        <View style={styles.badges}>
          <Badge label={`Reward: ${post.reward} RON`} color="#4CAF50" />
          <Badge label={post.status} color="#f44336" />
        </View>
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
  description: {
    marginBottom: 10,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MissingPostCard;
