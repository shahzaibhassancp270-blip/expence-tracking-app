import React, { useMemo, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Dimensions,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { useExpenses } from '../../context/ExpenseContext';
import ExpenseCard from '../../components/ExpenseCard';
import { COLORS, CATEGORIES } from '../../constants/theme';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { expenses } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesSearch = exp.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, selectedCategory]);

  // Safe category data — only rendered if data exists
  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const total = expenses
        .filter(exp => exp.category === cat.id)
        .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
      return {
        name: cat.name,
        population: total,
        color: cat.color,
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      };
    }).filter(cat => cat.population > 0);
  }, [expenses]);

  // Safe weekly data — always has 7 values
  const weeklyData = useMemo(() => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    const days = eachDayOfInterval({ start, end });
    const labels = days.map(d => format(d, 'EEE'));
    const data = days.map(d =>
      expenses
        .filter(exp => isSameDay(new Date(exp.date), d))
        .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
    );
    // Ensure no all-zero chart (chart-kit crashes on all zeros)
    const hasData = data.some(v => v > 0);
    return {
      labels,
      datasets: [{ data: hasData ? data : [0.01, 0, 0, 0, 0, 0, 0] }]
    };
  }, [expenses]);

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(0, 191, 165, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  };

  const totalSpend = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const topCategory = categoryData.length > 0
    ? categoryData.reduce((a, b) => a.population > b.population ? a : b)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Total Spent: ${totalSpend.toFixed(2)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList}>
          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === 'all' && styles.activeChip]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.filterText, selectedCategory === 'all' && styles.activeText]}>All</Text>
          </TouchableOpacity>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterChip, selectedCategory === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.filterText, selectedCategory === cat.id && { color: cat.color }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Highest Category Banner */}
        {topCategory && (
          <View style={[styles.topCategoryCard, { backgroundColor: topCategory.color + '15' }]}>
            <Ionicons name="trophy-outline" size={22} color={topCategory.color} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.topCategoryLabel}>Highest Spending</Text>
              <Text style={[styles.topCategoryName, { color: topCategory.color }]}>
                {topCategory.name} — ${topCategory.population.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Spending Trend - Line Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Trend</Text>
          <LineChart
            data={weeklyData}
            width={width - 60}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Daily Breakdown - Bar Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Spending</Text>
          <BarChart
            data={weeklyData}
            width={width - 60}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={0}
          />
        </View>

        {/* Category Distribution - only shown if data exists */}
        {categoryData.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Category Breakdown</Text>
            <PieChart
              data={categoryData}
              width={width - 60}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
            />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Category Breakdown</Text>
            <View style={styles.noDataContainer}>
              <Ionicons name="pie-chart-outline" size={48} color={COLORS.border} />
              <Text style={styles.noDataText}>Add expenses to see breakdown</Text>
            </View>
          </View>
        )}

        {/* Transaction History */}
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map(item => (
            <ExpenseCard
              key={item.id}
              expense={item}
              onPress={() => navigation.navigate('ExpenseDetail', { expense: item })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>No matching transactions</Text>
          </View>
        )}
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
    padding: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  filterList: {
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeText: {
    color: COLORS.primary,
  },
  topCategoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  topCategoryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  topCategoryName: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 15,
  },
  chart: {
    borderRadius: 12,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    color: COLORS.textSecondary,
    marginTop: 10,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginTop: 10,
    fontWeight: '500',
  },
});

export default AnalyticsScreen;
