import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Animated, Easing,
  ActivityIndicator, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES, PAYMENT_METHODS } from '../../constants/theme';

const AddExpenseScreen = ({ navigation, route }) => {
  const editExpense = route.params?.expense;
  const { addExpense, updateExpense } = useExpenses();
  const { user } = useAuth();
  const { theme } = useTheme();
  const C = theme.colors;

  const [title, setTitle] = useState(editExpense?.title || '');
  const [amount, setAmount] = useState(editExpense?.amount?.toString() || '');
  const [category, setCategory] = useState(editExpense?.category || 'food');
  const [paymentMethod, setPaymentMethod] = useState(editExpense?.paymentMethod || 'cash');
  const [note, setNote] = useState(editExpense?.note || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false); // ← green success state
  const [error, setError] = useState('');

  // Animations
  const formSlide = useRef(new Animated.Value(60)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const amountScale = useRef(new Animated.Value(0.85)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(formSlide, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
      Animated.timing(formOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(amountScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 9 }),
    ]).start();
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleSave = async () => {
    setError('');
    if (!title.trim()) { setError('Please enter a title.'); return; }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    animateButton();
    setLoading(true);

    const expenseData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      paymentMethod,
      note: note.trim(),
      imageUrl: null,
      date: editExpense?.date || new Date().toISOString(),
    };

    try {
      if (editExpense) {
        await updateExpense(editExpense.id, expenseData);
      } else {
        await addExpense(expenseData);
      }

      // ✅ KEY FIX: stop loading FIRST, show green success, THEN navigate
      setLoading(false);
      setSaved(true);
      setTimeout(() => {
        navigation.goBack();
      }, 700);

    } catch (err) {
      setLoading(false);
      setSaved(false);
      setError('Failed to save: ' + err.message);
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.id === category);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editExpense ? 'Edit' : 'New'} Expense</Text>
        <View style={{ width: 45 }} />
      </View>

      {/* Amount */}
      <Animated.View style={[styles.amountSection, { transform: [{ scale: amountScale }] }]}>
        <Text style={styles.currency}>$</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="rgba(255,255,255,0.4)"
          autoFocus={!editExpense}
          selectionColor="#FFF"
        />
      </Animated.View>

      {/* Selected category badge */}
      <View style={styles.selectedBadge}>
        <View style={[styles.badgeDot, { backgroundColor: selectedCategory?.color }]} />
        <Text style={styles.badgeText}>{selectedCategory?.name}</Text>
      </View>

      {/* Form */}
      <Animated.View
        style={[
          styles.formCard,
          { backgroundColor: C.background, opacity: formOpacity, transform: [{ translateY: formSlide }] }
        ]}
      >
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Title */}
          <Text style={[styles.label, { color: C.textSecondary }]}>TITLE</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: C.surface, color: C.text, borderColor: C.border }]}
            placeholder="What did you spend on?"
            placeholderTextColor={C.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          {/* Category */}
          <Text style={[styles.label, { color: C.textSecondary }]}>CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 22 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  { backgroundColor: C.surface, borderColor: C.border },
                  category === cat.id && { backgroundColor: cat.color + '25', borderColor: cat.color, borderWidth: 2 }
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Ionicons name={cat.icon} size={22} color={category === cat.id ? cat.color : C.textSecondary} />
                <Text style={[styles.categoryLabel, { color: category === cat.id ? cat.color : C.textSecondary }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Payment Method */}
          <Text style={[styles.label, { color: C.textSecondary }]}>PAYMENT METHOD</Text>
          <View style={styles.paymentList}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentItem,
                  { backgroundColor: C.surface, borderColor: C.border },
                  paymentMethod === method.id && { backgroundColor: C.primary + '15', borderColor: C.primary, borderWidth: 2 }
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons name={method.icon} size={18} color={paymentMethod === method.id ? C.primary : C.textSecondary} />
                <Text style={[styles.paymentLabel, { color: paymentMethod === method.id ? C.primary : C.textSecondary }]}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note */}
          <Text style={[styles.label, { color: C.textSecondary }]}>NOTE (OPTIONAL)</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: C.surface, color: C.text, borderColor: C.border, height: 90, textAlignVertical: 'top', paddingTop: 14 }]}
            placeholder="Add more details..."
            placeholderTextColor={C.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
          />

          {/* Save Button */}
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                saved
                  ? { backgroundColor: '#34C759' }
                  : { backgroundColor: C.primary, opacity: loading ? 0.9 : 1 }
              ]}
              onPress={handleSave}
              disabled={loading || saved}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.saveBtnInner}>
                  <ActivityIndicator color="#FFF" size="small" />
                  <Text style={styles.saveBtnText}>Saving...</Text>
                </View>
              ) : saved ? (
                <View style={styles.saveBtnInner}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                  <Text style={styles.saveBtnText}>
                    {editExpense ? 'Updated!' : 'Expense Saved! ✓'}
                  </Text>
                </View>
              ) : (
                <View style={styles.saveBtnInner}>
                  <Ionicons name={editExpense ? 'create-outline' : 'checkmark-circle-outline'} size={22} color="#FFF" />
                  <Text style={styles.saveBtnText}>{editExpense ? 'Update Expense' : 'Save Expense'}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  amountSection: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'flex-end', paddingBottom: 6,
  },
  currency: { fontSize: 34, fontWeight: '700', color: '#FFF', marginBottom: 10, marginRight: 4 },
  amountInput: { fontSize: 58, fontWeight: '800', color: '#FFF', minWidth: 120 },
  selectedBadge: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingBottom: 16,
  },
  badgeDot: { width: 10, height: 10, borderRadius: 5, marginRight: 7 },
  badgeText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '700' },
  formCard: { borderTopLeftRadius: 36, borderTopRightRadius: 36, flex: 1 },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 10, letterSpacing: 1.2 },
  textInput: {
    borderRadius: 14, padding: 15, fontSize: 16,
    borderWidth: 1.5, marginBottom: 22,
  },
  categoryItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, marginRight: 10, borderWidth: 1.5,
    gap: 7,
  },
  categoryLabel: { fontSize: 13, fontWeight: '600' },
  paymentList: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  paymentItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, gap: 6,
  },
  paymentLabel: { fontSize: 12, fontWeight: '600' },
  saveBtn: {
    height: 58, borderRadius: 18, justifyContent: 'center',
    alignItems: 'center', marginTop: 8,
    shadowColor: '#00BFA5', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  saveBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FF3B3015', borderRadius: 12,
    padding: 12, marginBottom: 18, borderWidth: 1, borderColor: '#FF3B3040',
  },
  errorText: { color: '#FF3B30', fontSize: 13, fontWeight: '600', flex: 1 },
});

export default AddExpenseScreen;
