import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SummaryCard = ({ total, budget, period = 'Monthly' }) => {
  const percentage = budget > 0 ? (total / budget) * 100 : 0;
  const remaining = budget - total;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.periodText}>{period} Spending</Text>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.budgetIcon}>
          <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
        </View>
      </View>
      
      <View style={styles.budgetContainer}>
        <View style={styles.row}>
          <Text style={styles.budgetText}>Budget: ${budget.toFixed(2)}</Text>
          <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
        </View>
        
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage > 90 ? COLORS.error : '#FFFFFF'
              }
            ]} 
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.remainingText}>
            {remaining >= 0 ? `Remaining: $${remaining.toFixed(2)}` : `Over Budget: $${Math.abs(remaining).toFixed(2)}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  periodText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  budgetIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 15,
  },
  budgetContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  percentageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    marginTop: 12,
  },
  remainingText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default SummaryCard;
