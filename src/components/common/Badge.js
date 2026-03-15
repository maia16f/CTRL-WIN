import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Badge = ({ label, color }) => {
  return (
    <View style={[styles.badge, { backgroundColor: color || '#E57373' }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Badge;
