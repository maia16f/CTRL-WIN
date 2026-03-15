import React from 'react';
import { Marker } from './MapWrapper';
import { View, Text, StyleSheet } from 'react-native';

export const MARKER_COLORS = {
  MISSING: '#E53935',
  FOUND: '#43A047',
};

const getPinColor = (post) => {
  if (post.type === 'MISSING') return MARKER_COLORS.MISSING;
  if (post.type === 'FOUND') return MARKER_COLORS.FOUND;
  return '#808080';
};

const PostMarker = ({ post, onPress }) => {
  return (
    <Marker
      coordinate={{
        latitude: post.location.latitude,
        longitude: post.location.longitude,
      }}
      pinColor={getPinColor(post)}
      onPress={onPress}
    >
      {post.type === 'MISSING' && (
        <View style={[styles.pawWrapper, styles.missingPaw]}>
          <Text style={styles.pawText}>🐾</Text>
        </View>
      )}
      {post.type === 'FOUND' && (
        <View style={[styles.pawWrapper, styles.foundPaw]}>
          <Text style={styles.pawText}>🐾</Text>
        </View>
      )}
    </Marker>
  );
};

const styles = StyleSheet.create({
  pawWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  missingPaw: {
    backgroundColor: '#E57373',
  },
  foundPaw: {
    backgroundColor: '#43A047',
  },
  pawText: {
    fontSize: 18,
  },
});

export default PostMarker;
