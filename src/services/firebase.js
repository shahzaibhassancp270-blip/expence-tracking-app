import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyABH1Roi_vTVPtaM6PGguQJ3HbPaL5TFhA",
  authDomain: "my-expence-app-d04bc.firebaseapp.com",
  projectId: "my-expence-app-d04bc",
  storageBucket: "my-expence-app-d04bc.firebasestorage.app",
  messagingSenderId: "737296260901",
  appId: "1:737296260901:web:f81ae0f8a68a7056dbc4cc",
};

const app = initializeApp(firebaseConfig);

// Firebase Auth only — no Firestore, no Storage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;