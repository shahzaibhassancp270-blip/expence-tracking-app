import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load data from AsyncStorage whenever user changes
  useEffect(() => {
    if (user?.uid) {
      loadData(user.uid);
    } else {
      setExpenses([]);
      setBudget(0);
    }
  }, [user?.uid]);

  const loadData = async (uid) => {
    setLoading(true);
    const [savedExpenses, savedBudget] = await Promise.all([
      expenseService.getExpenses(uid),
      expenseService.getBudget(uid),
    ]);
    setExpenses(savedExpenses);
    setBudget(savedBudget);
    setLoading(false);
  };

  const addExpense = useCallback(async (expenseData) => {
    if (!user?.uid) return;
    const newExpense = await expenseService.addExpense(user.uid, expenseData);
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, [user?.uid]);

  const updateExpense = useCallback(async (id, data) => {
    if (!user?.uid) return;
    const updated = await expenseService.updateExpense(user.uid, id, data);
    setExpenses(updated);
  }, [user?.uid]);

  const deleteExpense = useCallback(async (id) => {
    if (!user?.uid) return;
    const updated = await expenseService.deleteExpense(user.uid, id);
    setExpenses(updated);
  }, [user?.uid]);

  const updateBudget = useCallback(async (amount) => {
    if (!user?.uid) return;
    await expenseService.updateBudget(user.uid, amount);
    setBudget(amount);
  }, [user?.uid]);

  return (
    <ExpenseContext.Provider value={{
      expenses,
      budget,
      loading,
      addExpense,
      updateExpense,
      deleteExpense,
      updateBudget,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
