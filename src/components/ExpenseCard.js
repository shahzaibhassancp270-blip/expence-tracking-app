import React, { useRef } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  Animated, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useExpenses } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../constants/theme';

const ExpenseCard = ({ expense, onPress, showDelete = true }) => {
  const { deleteExpense } = useExpenses();
  const { theme } = useTheme();
  const C = theme.colors;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  }, []);

  const category = CATEGORIES.find(c => c.id === expense.category) || CATEGORIES[0];

  const onPressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true, tension: 200 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, tension: 200 }).start();
  };

  const handleDelete = () => {
    Alert.alert(
      '🗑️ Delete Expense',
      `Are you sure you want to delete "${expense.title}"?\n\nAmount: $${parseFloat(expense.amount).toFixed(2)}\n\nThis cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => animateAndDelete(),
        },
      ]
    );
  };

  const animateAndDelete = () => {
    // Animate card out with scale + fade, then delete from Firestore
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 280, useNativeDriver: true }),
    ]).start(async () => {
      try {
        await deleteExpense(expense.id);
      } catch (e) {
        Alert.alert('Error', 'Could not delete expense. Please try again.');
        // Reset animation if delete failed
        Animated.parallel([
          Animated.spring(opacityAnim, { toValue: 1, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
        ]).start();
      }
    });
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: opacityAnim,
          transform: [{ scale: Animated.multiply(scaleAnim, pressAnim) }],
        }
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: C.surface }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        {/* Category icon */}
        <View style={[styles.iconBox, { backgroundColor: category.color + '20' }]}>
          <Ionicons name={category.icon} size={22} color={category.color} />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.title, { color: C.text }]} numberOfLines={1}>{expense.title}</Text>
          <View style={styles.meta}>
            <View style={[styles.tag, { backgroundColor: category.color + '15' }]}>
              <Text style={[styles.tagText, { color: category.color }]}>{category.name}</Text>
            </View>
            <Text style={[styles.date, { color: C.textSecondary }]}>
              {format(new Date(expense.date), 'dd MMM')}
            </Text>
          </View>
        </View>

        {/* Amount + Delete */}
        <View style={styles.right}>
          <Text style={[styles.amount, { color: C.text }]}>
            -${parseFloat(expense.amount).toFixed(2)}
          </Text>
          {showDelete && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 18, padding: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '700' },
  date: { fontSize: 12, fontWeight: '500' },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 16, fontWeight: '800' },
  deleteBtn: {
    backgroundColor: '#FF3B3015', padding: 6,
    borderRadius: 8, borderWidth: 1, borderColor: '#FF3B3030',
  },
});

export default ExpenseCard;
