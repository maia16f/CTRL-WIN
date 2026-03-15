import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, POST_TYPES } from '../../utils/constants';

const LABELS = {
  [POST_TYPES.MISSING]: 'Lost Animals',
  [POST_TYPES.FOUND]: 'Found Animals',
  [POST_TYPES.ADOPTION]: 'Adopt Animals',
  [POST_TYPES.MATING]: 'Love Radar',
  [POST_TYPES.SOCIAL]: 'Social',
};

export default function PostCreatorModal() {
  const navigation = useNavigation();

  const handleSelect = (type) => {
    if (type === POST_TYPES.MATING) {
      navigation.navigate('CreateMatingPost');
    } else {
      navigation.navigate('CreatePost', { postType: type });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What type of post do you want to create?</Text>
      {[POST_TYPES.MISSING, POST_TYPES.FOUND, POST_TYPES.ADOPTION, POST_TYPES.MATING].map((type) => (
        <TouchableOpacity
          key={type}
          style={styles.button}
          onPress={() => handleSelect(type)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{LABELS[type] || type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
