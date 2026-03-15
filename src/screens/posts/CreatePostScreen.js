import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../utils/constants';

const CreatePostScreen = ({ route, navigation }) => {
  const { postType } = route.params || {};
  const [description, setDescription] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Creează anunț {postType}</Text>
      <TextInput
        style={styles.input}
        placeholder="Descriere..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Postează</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePostScreen;
