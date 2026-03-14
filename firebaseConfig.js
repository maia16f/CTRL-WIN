import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbKq8FxdnXMdoPlWamvRRu2Z_SjrykE44",
  authDomain: "pawapp-30ed5.firebaseapp.com",
  projectId: "pawapp-30ed5",
  storageBucket: "pawapp-30ed5.firebasestorage.app",
  messagingSenderId: "211909427191",
  appId: "1:211909427191:web:b96bb828851ff11adb38f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
