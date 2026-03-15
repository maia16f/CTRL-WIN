import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { COLORS } from '../../utils/constants';
import Avatar from '../../components/common/Avatar';

const ProfileScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'pets'), where('ownerId', '==', user.uid));
    const unsub = onSnapshot(q, snap => {
      setPets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  if (!userProfile) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar source={{ uri: userProfile.photoURL || 'https://via.placeholder.com/150' }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{userProfile.displayName || 'Utilizator Anonim'}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
          <Text style={styles.points}>✨ {userProfile.communityPoints} Puncte</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.petsSection}>
        <View style={styles.petsHeader}>
          <Text style={styles.sectionTitle}>Animalele mele</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
            <Text style={styles.addText}>+ Adaugă</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
           <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <FlatList
            data={pets}
            horizontal
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.petCard} onPress={() => navigation.navigate('PetProfile', { pet: item })}>
                <Image source={{ uri: item.photoURL || 'https://via.placeholder.com/80' }} style={styles.petImage} />
                <Text style={styles.petName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Nu ai adăugat niciun animal încă.</Text>}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  email: {
    color: COLORS.textLight,
    marginBottom: 5,
  },
  points: {
    color: COLORS.warning,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  petsSection: {
    padding: 20,
  },
  petsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  addText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  petCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  petName: {
    fontWeight: '500',
    color: COLORS.textDark,
  },
  emptyText: {
    color: COLORS.textLight,
    fontStyle: 'italic',
  }
});

export default ProfileScreen;
