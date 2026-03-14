import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('parola_test123');
  const router = useRouter();

  const handleContinue = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Eroare', 'Introdu o adresă de email validă.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (createError: any) {
      if (createError.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          router.replace('/(tabs)');
        } catch (loginError: any) {
          Alert.alert('Eroare la logare', loginError.message);
        }
      } else {
        Alert.alert('Eroare', createError.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoText}>PawRadar</Text>
        <View style={styles.authBox}>
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Enter your email to sign up for this app</Text>
          <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color="black" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={20} color="black" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#E57373', marginBottom: 40, fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium' },
  authBox: { width: '100%', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 25, textAlign: 'center' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 15, backgroundColor: '#FFF', marginBottom: 15, fontSize: 16 },
  continueButton: { width: '100%', height: 50, backgroundColor: '#E57373', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 10, color: '#888', fontSize: 12 },
  socialButton: { flexDirection: 'row', width: '100%', height: 50, backgroundColor: '#EEE', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  socialIcon: { marginRight: 10 },
  socialText: { fontSize: 14, fontWeight: '500', color: '#000' }
});