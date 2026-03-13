import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100' }} 
          style={styles.profilePic} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>Helena Hills</Text>
          <Text style={styles.activeStatus}>Active 11m ago</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="call-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="videocam-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mesaje */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.myMessageContainer}>
          <View style={styles.myMessage}>
            <Text style={styles.myMessageText}>Hi! I think you found my pet!!</Text>
          </View>
        </View>

        <Text style={styles.timestamp}>Nov 30, 2023, 9:41 AM</Text>

        <View style={styles.otherMessageRow}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100' }} style={styles.miniPic} />
          <View>
            <View style={styles.otherMessage}><Text>Oh?</Text></View>
            <View style={styles.otherMessage}><Text>Cool</Text></View>
            <View style={styles.otherMessage}><Text>How does it work?</Text></View>
          </View>
        </View>

        <View style={styles.myMessageContainer}>
          <View style={styles.myMessage}>
            <Text style={styles.myMessageText}>Well if you are from here, you can just send me your location or a meeting spot!</Text>
          </View>
          <View style={[styles.myMessage, { marginTop: 5 }]}>
            <Text style={styles.myMessageText}>And thank you so so much!</Text>
          </View>
        </View>
      </ScrollView>

      {/* Input de mesaj */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput 
            style={styles.input} 
            placeholder="Message..." 
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity><Ionicons name="mic-outline" size={24} color="#888" style={styles.inputIcon}/></TouchableOpacity>
          <TouchableOpacity><Ionicons name="happy-outline" size={24} color="#888" style={styles.inputIcon}/></TouchableOpacity>
          <TouchableOpacity><Ionicons name="image-outline" size={24} color="#888" style={styles.inputIcon}/></TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 50, 
    paddingBottom: 15, 
    paddingHorizontal: 15, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#EEE' 
  },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
  headerInfo: { marginLeft: 10, flex: 1 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  activeStatus: { fontSize: 12, color: '#888' },
  headerIcons: { flexDirection: 'row' },
  chatContainer: { flex: 1, padding: 15 },
  myMessageContainer: { alignItems: 'flex-end', marginBottom: 15 },
  myMessage: { backgroundColor: '#000', padding: 12, borderRadius: 20, maxWidth: '80%' },
  myMessageText: { color: '#FFF' },
  timestamp: { textAlign: 'center', color: '#BBB', fontSize: 12, marginVertical: 20 },
  otherMessageRow: { flexDirection: 'row', marginBottom: 15 },
  miniPic: { width: 25, height: 25, borderRadius: 12.5, alignSelf: 'flex-end', marginRight: 8 },
  otherMessage: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 15, marginBottom: 4, maxWidth: '85%' },
  inputContainer: { padding: 15, paddingBottom: 30 },
  inputWrapper: { 
    flexDirection: 'row', 
    backgroundColor: '#F9F9F9', 
    borderRadius: 15, 
    alignItems: 'center', 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  input: { flex: 1, height: 45 },
  inputIcon: { marginLeft: 10 }
});