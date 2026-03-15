import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../utils/constants';

const CreateMatingPostScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    Alert.alert('Info', 'Funcționalitatea de creare anunț montă va fi implementată aici.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adaugă Anunț Montă</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Titlu anunț"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Descriere, preferințe, detalii..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Postează</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 },
  input: { backgroundColor: COLORS.white, padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});

export default CreateMatingPostScreen;
