import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';

const MatingDetailScreen = ({ route, navigation }) => {
  const { post } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: post.photos?.[0] || 'https://via.placeholder.com/300' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
        
        <View style={styles.detailsBox}>
          <Text style={styles.detailText}>🐾 Specie: {post.matingDetails?.species}</Text>
          <Text style={styles.detailText}>🏷️ Rasă: {post.matingDetails?.breed}</Text>
          <Text style={styles.detailText}>⚧ Gen: {post.matingDetails?.gender}</Text>
          <Text style={styles.detailText}>💰 Preț: {post.matingDetails?.price} {post.matingDetails?.currency}</Text>
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('Chat', { conversationId: `contact_${post.id}` })}>
          <Text style={styles.contactButtonText}>Contactează Proprietarul</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: 300 },
  content: { padding: 20, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10 },
  description: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  detailsBox: { backgroundColor: COLORS.background, padding: 15, borderRadius: 10, marginBottom: 20 },
  detailText: { fontSize: 16, color: COLORS.textDark, marginBottom: 5, fontWeight: '500' },
  contactButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center' },
  contactButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }
});

export default MatingDetailScreen;
