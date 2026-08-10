import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogOut, Users, Settings, Clock } from 'lucide-react-native';
import api from '../../utils/api';

export default function AdminDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState({ bookingMenunggu: 0, totalLayanan: 0, totalPelanggan: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) setAdminName(JSON.parse(userDataStr).name);
      };
      loadUser();
      setLoading(true);
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {adminName}</Text>
          <Text style={styles.brandText}>SATRA <Text style={styles.textPrimary}>GARAGE+</Text></Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut color="#FFF" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC2626']} />}
      >
        <Text style={styles.sectionTitle}>STATISTIK <Text style={styles.textPrimary}>BENGKEL</Text></Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#DC2626" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(234,179,8,0.2)' }]}>
                <Clock color="#EAB308" size={32} />
              </View>
              <Text style={styles.statNumber}>{stats.bookingMenunggu}</Text>
              <Text style={styles.statLabel}>BOOKING MENUNGGU</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(59,130,246,0.2)' }]}>
                <Users color="#3B82F6" size={32} />
              </View>
              <Text style={styles.statNumber}>{stats.totalPelanggan}</Text>
              <Text style={styles.statLabel}>TOTAL PELANGGAN</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(34,197,94,0.2)' }]}>
                <Settings color="#22C55E" size={32} />
              </View>
              <Text style={styles.statNumber}>{stats.totalLayanan}</Text>
              <Text style={styles.statLabel}>LAYANAN TERSEDIA</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#1E293B', borderBottomWidth: 4, borderBottomColor: '#DC2626' },
  greeting: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  brandText: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', color: '#FFF' },
  textPrimary: { color: '#DC2626' },
  logoutBtn: { backgroundColor: '#DC2626', padding: 10, borderRadius: 50 },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: '#0F172A', marginBottom: 20 },
  statsContainer: { gap: 16 },
  statCard: { backgroundColor: '#FFF', padding: 24, borderWidth: 2, borderColor: '#0F172A', borderLeftWidth: 8, borderLeftColor: '#0F172A', elevation: 2, shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.1, shadowRadius: 0, flexDirection: 'row', alignItems: 'center', gap: 20 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  statNumber: { fontSize: 36, fontWeight: '900', fontStyle: 'italic', color: '#0F172A', flex: 1 },
  statLabel: { fontSize: 12, fontWeight: '900', color: '#64748B', width: 100, textAlign: 'right' }
});
