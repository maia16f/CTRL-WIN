import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Text style={styles.logoText}>PawRadar</Text>

        <View style={styles.authBox}>
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Enter your email to sign up for this app</Text>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color="black" style={{ marginRight: 10 }} />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={20} color="black" style={{ marginRight: 10 }} />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            By clicking continue, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#E57373', marginBottom: 40 },
  authBox: { width: '100%', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 25 },
  input: { 
    width: '100%', 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    backgroundColor: '#FFF',
    marginBottom: 15
  },
  continueButton: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#E57373', 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 20
  },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 10, color: '#888', fontSize: 12 },
  socialButton: { 
    flexDirection: 'row',
    width: '100%', 
    height: 50, 
    backgroundColor: '#EEE', 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 10
  },
  socialText: { fontSize: 14, fontWeight: '500' },
  termsText: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 20, paddingHorizontal: 20 },
  link: { textDecorationLine: 'underline' }
});