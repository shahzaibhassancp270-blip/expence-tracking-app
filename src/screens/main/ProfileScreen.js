import React, { useState } from 'react';
import {
  StyleSheet, View, Text, SafeAreaView,
  TouchableOpacity, ScrollView, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { useTheme } from '../../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { expenses, budget } = useExpenses();
  const { theme } = useTheme();
  const C = theme.colors;

  const [profileImage, setProfileImage] = useState(null);

  // Load saved profile image from local storage
  React.useEffect(() => {
    AsyncStorage.getItem('profile_image').then(uri => {
      if (uri) setProfileImage(uri);
    });
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to set a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem('profile_image', uri);
      Alert.alert('✅ Profile Photo Updated', 'Your profile picture has been saved.');
    }
  };

  const totalExpenses = expenses.length;
  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const menuItems = [
    { id: '1', title: 'Budget & Settings', icon: 'settings-outline', color: '#5856D6', screen: 'Settings' },
    { id: '2', title: 'Analytics', icon: 'stats-chart-outline', color: '#34C759', screen: 'Analytics' },
    { id: '3', title: 'Notifications', icon: 'notifications-outline', color: '#FF9500', screen: 'Settings' },
    { id: '4', title: 'Dark Mode', icon: 'moon-outline', color: '#AF52DE', screen: 'Settings' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.surface }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={[styles.profileCard, { backgroundColor: C.surface }]}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: C.primary }]}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.name, { color: C.text }]}>{user?.fullName || 'User'}</Text>
          <Text style={[styles.email, { color: C.textSecondary }]}>{user?.email}</Text>
          <Text style={[styles.tapHint, { color: C.primary }]}>Tap avatar to change photo</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.statValue, { color: C.primary }]}>{totalExpenses}</Text>
            <Text style={[styles.statLabel, { color: C.textSecondary }]}>Transactions</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.statValue, { color: C.primary }]}>${thisMonth.toFixed(0)}</Text>
            <Text style={[styles.statLabel, { color: C.textSecondary }]}>This Month</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.statValue, { color: C.primary }]}>${budget?.toFixed(0) || '0'}</Text>
            <Text style={[styles.statLabel, { color: C.textSecondary }]}>Budget</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: C.surface }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuTitle, { color: C.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: '#FF3B30' + '10', borderColor: '#FF3B30' }]}
          onPress={() => {
            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: logout }
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: C.textSecondary }]}>SmartSpend v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  profileCard: {
    alignItems: 'center', borderRadius: 24, padding: 25, marginBottom: 20,
  },
  avatarWrapper: { marginBottom: 15, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarFallback: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 40, fontWeight: '800', color: '#FFFFFF' },
  editBadge: {
    position: 'absolute', bottom: 2, right: 2,
    backgroundColor: '#00BFA5', width: 28, height: 28,
    borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 6 },
  tapHint: { fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  menuContainer: { marginBottom: 20 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 16, marginBottom: 10,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  menuTitle: { fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 16, borderWidth: 1.5, marginBottom: 20,
  },
  logoutText: { color: '#FF3B30', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  versionText: { textAlign: 'center', fontSize: 12 },
});

export default ProfileScreen;
