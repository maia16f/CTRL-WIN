import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import { COLORS } from '../../utils/constants';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'ANDROID_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Nu e nevoie de navigare explicită, AuthContext va face update și RootNavigator va randa MainTabs
    } catch (error) {
      Alert.alert('Login error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoText}>PawRadar</Text>
        <View style={styles.authBox}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
            <Text style={styles.continueText}>Sign in</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
            <Ionicons name="logo-google" size={20} color="black" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginBottom: 40, fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium' },
  authBox: { width: '100%', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 5 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 25, textAlign: 'center' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 15, backgroundColor: COLORS.white, marginBottom: 15, fontSize: 16 },
  continueButton: { width: '100%', height: 50, backgroundColor: COLORS.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  continueText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  linkButton: { marginBottom: 20 },
  linkText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 10, color: COLORS.textLight, fontSize: 12 },
  socialButton: { flexDirection: 'row', width: '100%', height: 50, backgroundColor: '#EEE', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  socialIcon: { marginRight: 10 },
  socialText: { fontSize: 14, fontWeight: '500', color: COLORS.textDark }
});