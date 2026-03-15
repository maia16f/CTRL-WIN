import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch sau creează profilul Firestore
        const profileRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(profileRef);
        if (!snap.exists()) {
          await setDoc(profileRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || '',
            createdAt: serverTimestamp(),
            communityPoints: 0,
            isVerifiedShelter: false
          });
        }
        setUserProfile(snap.data() || {});
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
