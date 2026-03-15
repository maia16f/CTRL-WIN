import React from 'react';
import { Marker } from './MapWrapper';

const getPinColor = (createdAt) => {
  if (!createdAt) return '#808080';
  const hours = (Date.now() - createdAt.toMillis()) / 3600000;
  if (hours < 24) return '#FF0000'; // Roșu — critic
  if (hours < 72) return '#FF8C00'; // Portocaliu — recent
  if (hours < 168) return '#FFD700'; // Galben — o săptămână
  return '#808080'; // Gri — vechi
};

const PostMarker = ({ post, onPress }) => {
  return (
    <Marker
      coordinate={{
        latitude: post.location.latitude,
        longitude: post.location.longitude,
      }}
      pinColor={getPinColor(post.createdAt)}
      onPress={onPress}
    />
  );
};

export default PostMarker;
