/**
 * expenseService.js
 * All data stored locally using AsyncStorage — no Firestore, no network calls.
 * Operations are instant.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (userId, type) => `smartspend_${type}_${userId}`;

export const expenseService = {
  // ─── EXPENSES ────────────────────────────────────────────────
  getExpenses: async (userId) => {
    try {
      const raw = await AsyncStorage.getItem(key(userId, 'expenses'));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addExpense: async (userId, expense) => {
    const expenses = await expenseService.getExpenses(userId);
    const newExpense = {
      ...expense,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      createdAt: new Date().toISOString(),
      date: expense.date || new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    await AsyncStorage.setItem(key(userId, 'expenses'), JSON.stringify(updated));
    return newExpense;
  },

  updateExpense: async (userId, id, data) => {
    const expenses = await expenseService.getExpenses(userId);
    const updated = expenses.map(e => e.id === id ? { ...e, ...data } : e);
    await AsyncStorage.setItem(key(userId, 'expenses'), JSON.stringify(updated));
    return updated;
  },

  deleteExpense: async (userId, id) => {
    const expenses = await expenseService.getExpenses(userId);
    const updated = expenses.filter(e => e.id !== id);
    await AsyncStorage.setItem(key(userId, 'expenses'), JSON.stringify(updated));
    return updated;
  },

  // ─── BUDGET ──────────────────────────────────────────────────
  getBudget: async (userId) => {
    try {
      const raw = await AsyncStorage.getItem(key(userId, 'budget'));
      return raw ? parseFloat(raw) : 0;
    } catch {
      return 0;
    }
  },

  updateBudget: async (userId, amount) => {
    await AsyncStorage.setItem(key(userId, 'budget'), amount.toString());
  },

  // ─── USER PROFILE ────────────────────────────────────────────
  getProfile: async (userId) => {
    try {
      const raw = await AsyncStorage.getItem(key(userId, 'profile'));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveProfile: async (userId, profile) => {
    const existing = await expenseService.getProfile(userId);
    const updated = { ...existing, ...profile };
    await AsyncStorage.setItem(key(userId, 'profile'), JSON.stringify(updated));
    return updated;
  },

  // ─── CLEAR ALL (for account deletion) ────────────────────────
  clearAllData: async (userId) => {
    await AsyncStorage.multiRemove([
      key(userId, 'expenses'),
      key(userId, 'budget'),
      key(userId, 'profile'),
    ]);
  },
};
