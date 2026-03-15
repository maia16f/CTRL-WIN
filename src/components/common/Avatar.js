import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Avatar = ({ source, style }) => {
  return <Image source={source} style={[styles.avatar, style]} />;
};

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default Avatar;
