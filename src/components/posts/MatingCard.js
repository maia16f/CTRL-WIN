import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Badge from '../common/Badge';

const MatingCard = ({ post, userLocation, navigation }) => {
  const { matingDetails } = post;

  const openChat = (post) => {
    // To be implemented
  };

  return (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post })}>
      <View style={styles.card}>
        <Image source={{ uri: post.photos[0] }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{matingDetails.breed} • {matingDetails.gender === 'male' ? '♂' : '♀'}</Text>
          <Text>{Math.round(matingDetails.age / 12)} ani</Text>
          {matingDetails.pedigree && <Badge label='Pedigree' color='gold' />}
          <Text>{matingDetails.price === 0 ? 'Gratuit' : `${matingDetails.price} RON`}</Text>
          <TouchableOpacity style={styles.button} onPress={() => openChat(post)}>
            <Text style={styles.buttonText}>Contactează</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
  button: {
    backgroundColor: '#E57373',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MatingCard;
