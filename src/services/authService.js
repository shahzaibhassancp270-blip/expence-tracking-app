import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from './firebase';

export const authService = {
  register: async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { ...userCredential.user, fullName };
  },

  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  logout: async () => {
    await signOut(auth);
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  loginWithGoogle: async (accessToken) => {
    const credential = GoogleAuthProvider.credential(null, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  },

  deleteAccount: async (password) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not logged in');
    if (password) {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
    }
    await deleteUser(currentUser);
  },

  subscribeToAuthChanges: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};
