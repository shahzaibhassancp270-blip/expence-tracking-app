import React, { useState } from 'react';
import {
  StyleSheet, View, Text, SafeAreaView, ScrollView,
  TouchableOpacity, Switch, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { budget, updateBudget } = useExpenses();
  const { user, logout, deleteAccount } = useAuth();
  const { theme, toggleDark } = useTheme();
  const C = theme.colors;

  const [newBudget, setNewBudget] = useState(budget?.toString() || '0');
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateBudget = async () => {
    if (!newBudget || isNaN(newBudget) || parseFloat(newBudget) < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }
    setLoading(true);
    try {
      await updateBudget(parseFloat(newBudget));
      Alert.alert('✅ Budget Updated', `Your monthly budget has been set to $${parseFloat(newBudget).toFixed(2)}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update budget: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'This will permanently delete your account and ALL your expense data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirm Password',
              'Enter your password to confirm:',
              async (password) => {
                if (!password) return;
                setDeleteLoading(true);
                try {
                  await deleteAccount(password);
                  // No need to navigate — AuthContext sets user to null → app goes to login screen
                } catch (error) {
                  Alert.alert('Error', 'Could not delete account. Please check your password and try again.');
                  setDeleteLoading(false);
                }
              },
              'secure-text'
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: C.background }]}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>Settings</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Budget Section */}
        <Text style={[styles.sectionTitle, { color: C.text }]}>Budget Management</Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <Text style={[styles.label, { color: C.textSecondary }]}>Monthly Budget ($)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.budgetInput, { backgroundColor: C.background, color: C.text, borderColor: C.border }]}
              value={newBudget}
              onChangeText={setNewBudget}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={C.textSecondary}
            />
            <TouchableOpacity
              style={[styles.updateBtn, { backgroundColor: C.primary }]}
              onPress={handleUpdateBudget}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.updateBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={[styles.helperText, { color: C.textSecondary }]}>
            Current budget: ${parseFloat(budget || 0).toFixed(2)} / month
          </Text>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: C.text }]}>Preferences</Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#FF9500' + '20' }]}>
                <Ionicons name="notifications-outline" size={20} color="#FF9500" />
              </View>
              <Text style={[styles.settingLabel, { color: C.text }]}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: C.border, true: C.primary + '80' }}
              thumbColor={notifications ? C.primary : '#F4F3F4'}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#5856D6' + '20' }]}>
                <Ionicons name="moon-outline" size={20} color="#5856D6" />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: C.text }]}>Dark Mode</Text>
                <Text style={[styles.settingSubLabel, { color: C.textSecondary }]}>
                  {theme.isDark ? 'Dark theme active' : 'Light theme active'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme.isDark}
              onValueChange={toggleDark}
              trackColor={{ false: C.border, true: C.primary + '80' }}
              thumbColor={theme.isDark ? C.primary : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Account Info */}
        <Text style={[styles.sectionTitle, { color: C.text }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, { color: C.textSecondary }]}>Full Name</Text>
            <Text style={[styles.infoVal, { color: C.text }]}>{user?.fullName || 'N/A'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.infoKey, { color: C.textSecondary }]}>Email</Text>
            <Text style={[styles.infoVal, { color: C.text }]} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>Danger Zone</Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <Text style={[styles.helperText, { color: C.textSecondary, marginBottom: 15 }]}>
            Deleting your account will permanently remove all your data including expenses and budget settings.
          </Text>
          <TouchableOpacity
            style={[styles.deleteBtn]}
            onPress={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <ActivityIndicator color="#FF3B30" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                <Text style={styles.deleteBtnText}>Delete My Account</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 45, height: 45, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10, marginLeft: 4, letterSpacing: 0.5 },
  card: { borderRadius: 20, padding: 18, marginBottom: 25 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  budgetInput: {
    flex: 1, height: 50, borderRadius: 12, paddingHorizontal: 15,
    fontSize: 16, fontWeight: '700', marginRight: 10, borderWidth: 1,
  },
  updateBtn: {
    width: 80, height: 50, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  updateBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  helperText: { fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  settingSubLabel: { fontSize: 12, marginTop: 2 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  infoKey: { fontSize: 14, fontWeight: '500' },
  infoVal: { fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#FF3B30',
  },
  deleteBtnText: { color: '#FF3B30', fontWeight: '700', fontSize: 15, marginLeft: 8 },
});

export default SettingsScreen;
