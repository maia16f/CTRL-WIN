import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function NotificationsScreen() {
  const router = useRouter();

  if (!auth.currentUser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.authText}>Loghează-te pentru a vedea activitatea.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth')}>
          <Text style={styles.loginBtnText}>Mergi la Logare</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Activity</Text>
        
        <View style={styles.pill}><Text style={styles.pillText}>Messages</Text></View>

        {/* Notificarea 1 */}
        <View style={styles.item}>
          <View style={styles.dot} />
          <Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.username}>starryskies23 <Text style={styles.time}>1d</Text></Text>
            <Text style={styles.action}>Just messaged you!</Text>
          </View>
        </View>

        {/* Notificarea 2 */}
        <View style={styles.item}>
          <View style={styles.dot} />
          <Image source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.username}>nebulanomad <Text style={styles.time}>1d</Text></Text>
            <Text style={styles.action}>Just messaged you!</Text>
          </View>
        </View>

        {/* Notificarea 3 */}
        <View style={styles.item}>
          <View style={styles.dot} />
          <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.username}>lunavoyager <Text style={styles.time}>3d</Text></Text>
            <Text style={styles.action}>Saved your post</Text>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100' }} style={styles.postThumbnail} />
        </View>

        {/* Notificarea 4 */}
        <View style={styles.item}>
          <View style={styles.dot} />
          <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.username}>shadowlynx <Text style={styles.time}>4d</Text></Text>
            <Text style={styles.action}>Commented on your post</Text>
            <Text style={styles.comment}>I think I saw him , message me!</Text>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100' }} style={styles.postThumbnail} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  authText: { fontSize: 16, marginBottom: 20 },
  loginBtn: { backgroundColor: '#E57373', padding: 15, borderRadius: 10 },
  loginBtnText: { color: '#FFF', fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  pill: { backgroundColor: '#F08080', alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginBottom: 25 },
  pillText: { color: '#FFF', fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF4081', marginRight: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  textContainer: { flex: 1 },
  username: { fontWeight: 'bold', fontSize: 15, color: '#333' },
  time: { fontWeight: 'normal', color: '#AAA', fontSize: 13 },
  action: { color: '#888', fontSize: 14, marginTop: 2 },
  comment: { color: '#333', fontSize: 14, marginTop: 2 },
  postThumbnail: { width: 50, height: 50, borderRadius: 10, marginLeft: 10 }
});