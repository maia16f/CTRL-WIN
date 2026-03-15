import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAbKq8FxdnXMdoPlWamvRRu2Z_SjrykE44",
  authDomain: "pawapp-30ed5.firebaseapp.com",
  projectId: "pawapp-30ed5",
  storageBucket: "pawapp-30ed5.appspot.com",
  messagingSenderId: "211909427191",
  appId: "1:211909427191:web:b96bb828851ff11adb38f2",
  databaseURL: "https://pawapp-30ed5-default-rtdb.europe-west1.firebasedatabase.app"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
