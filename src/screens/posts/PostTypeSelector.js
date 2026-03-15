import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, POST_TYPES } from '../../utils/constants';

const PostTypeSelector = ({ navigation }) => {
  const handleSelect = (type) => {
    navigation.navigate('CreatePost', { postType: type });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alege tipul anunțului</Text>
      {Object.values(POST_TYPES).map(type => (
        <TouchableOpacity key={type} style={styles.button} onPress={() => handleSelect(type)}>
          <Text style={styles.buttonText}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostTypeSelector;
