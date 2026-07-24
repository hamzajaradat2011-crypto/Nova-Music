import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Use custom Firestore Database ID specified in firebase-applet-config.json
export const db = getFirestore(app, config.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Initialize anonymous auth or ensure persistent auth session
export const initFirebaseAuth = async () => {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
      console.log('Firebase Anonymous Auth connected:', auth.currentUser?.uid);
    } catch (err) {
      console.warn('Firebase Auth notice:', err);
    }
  }
  return auth.currentUser;
};
