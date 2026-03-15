import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { COLORS } from '../../utils/constants';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Eroare', 'Toate câmpurile sunt obligatorii.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        photoURL: '',
        createdAt: serverTimestamp(),
        communityPoints: 0,
        isVerifiedShelter: false
      });
      
      // Nu e nevoie de navigare explicită, AuthContext va face update și RootNavigator va randa MainTabs
    } catch (error) {
      Alert.alert('Eroare la înregistrare', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Creare Cont Nou</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nume complet"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Parolă"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Înregistrare</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Ai deja cont? Conectează-te</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 30, textAlign: 'center' },
  input: {
    width: '100%', height: 50, borderWidth: 1, borderColor: '#DDD', 
    borderRadius: 8, paddingHorizontal: 15, backgroundColor: COLORS.white, 
    marginBottom: 15, fontSize: 16
  },
  button: {
    width: '100%', height: 50, backgroundColor: COLORS.primary, 
    borderRadius: 8, alignItems: 'center', justifyContent: 'center', 
    marginTop: 10, marginBottom: 20
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center' },
  linkText: { color: COLORS.textLight, fontSize: 14 }
});