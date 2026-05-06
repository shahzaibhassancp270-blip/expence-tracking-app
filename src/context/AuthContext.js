import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { expenseService } from '../services/expenseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        // Load profile from local storage
        const profile = await expenseService.getProfile(firebaseUser.uid);
        setUser({ 
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          fullName: profile.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          ...profile
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const firebaseUser = await authService.login(email, password);
    const profile = await expenseService.getProfile(firebaseUser.uid);
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: profile.fullName || firebaseUser.email?.split('@')[0],
      ...profile
    });
    return firebaseUser;
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    const firebaseUser = await authService.register(email, password, fullName);
    // Save name locally
    await expenseService.saveProfile(firebaseUser.uid, { fullName, email });
    setUser({ uid: firebaseUser.uid, email, fullName });
    return firebaseUser;
  }, []);

  const loginWithGoogle = useCallback(async (accessToken) => {
    const firebaseUser = await authService.loginWithGoogle(accessToken);
    const profile = await expenseService.getProfile(firebaseUser.uid);
    const fullName = profile.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0];
    if (!profile.fullName) {
      await expenseService.saveProfile(firebaseUser.uid, { fullName, email: firebaseUser.email });
    }
    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, fullName, ...profile });
    return firebaseUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    if (!user?.uid) return;
    const updated = await expenseService.saveProfile(user.uid, data);
    setUser(prev => ({ ...prev, ...updated }));
  }, [user]);

  const deleteAccount = useCallback(async (password) => {
    if (!user?.uid) return;
    await expenseService.clearAllData(user.uid);
    await authService.deleteAccount(password);
    setUser(null);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
