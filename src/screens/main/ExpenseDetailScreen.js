import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useExpenses } from '../../context/ExpenseContext';
import { COLORS, CATEGORIES, PAYMENT_METHODS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const ExpenseDetailScreen = ({ navigation, route }) => {
  const { expense } = route.params;
  const { deleteExpense } = useExpenses();
  
  const category = CATEGORIES.find(c => c.id === expense.category) || CATEGORIES[CATEGORIES.length - 1];
  const paymentMethod = PAYMENT_METHODS.find(m => m.id === expense.paymentMethod) || PAYMENT_METHODS[0];

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('AddExpense', { expense })} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={[styles.actionBtn, { marginLeft: 10 }]}>
            <Ionicons name="trash-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.amountCard}>
          <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
            <Ionicons name={category.icon} size={40} color={category.color} />
          </View>
          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.amount}>-${parseFloat(expense.amount).toFixed(2)}</Text>
          <View style={[styles.badge, { backgroundColor: category.color + '20' }]}>
            <Text style={[styles.badgeText, { color: category.color }]}>{category.name}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.infoLabel}>Date</Text>
            </View>
            <Text style={styles.infoValue}>{format(new Date(expense.date), 'EEEE, MMM dd, yyyy')}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="card-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.infoLabel}>Payment Method</Text>
            </View>
            <Text style={styles.infoValue}>{paymentMethod.name}</Text>
          </View>

          {expense.note ? (
            <View style={styles.noteSection}>
              <Text style={styles.noteLabel}>Note</Text>
              <Text style={styles.noteText}>{expense.note}</Text>
            </View>
          ) : null}
        </View>

        {expense.imageUrl ? (
          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Receipt</Text>
            <Image 
              source={{ uri: expense.imageUrl }} 
              style={styles.receiptImage} 
              resizeMode="cover"
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 15,
  },
  badge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 10,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  noteSection: {
    marginTop: 15,
  },
  noteLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 12,
  },
  receiptSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  receiptLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 15,
  },
  receiptImage: {
    width: '100%',
    height: width * 0.7,
    borderRadius: 24,
    backgroundColor: COLORS.border,
  },
});

export default ExpenseDetailScreen;
