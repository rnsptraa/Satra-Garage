import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { ReceiptText, AlertCircle } from 'lucide-react-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      const userId = userDataStr ? JSON.parse(userDataStr).id : 1;
      const response = await api.get(`/customer/history/${userId}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Memuat data setiap kali screen ini difokuskan
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return '#EAB308'; // Yellow
      case 'PROSES': return '#3B82F6'; // Blue
      case 'SELESAI': return '#22C55E'; // Green
      case 'LUNAS': return '#10B981'; // Emerald
      case 'BATAL': return '#EF4444'; // Red
      default: return '#94A3B8';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RIWAYAT <Text style={{color: '#DC2626'}}>SERVIS</Text></Text>
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC2626']} />}
        >
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AlertCircle color="#94A3B8" size={48} />
              <Text style={styles.emptyText}>Belum ada riwayat servis.</Text>
            </View>
          ) : (
            history.map((item, index) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.dateText}>{new Date(item.waktuBooking).toLocaleDateString('id-ID')}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <Text style={styles.serviceName}>{item.layanan.nama}</Text>
                  <Text style={styles.vehicleName}>{item.kendaraan.merek} {item.kendaraan.model} ({item.kendaraan.platNomor})</Text>
                  <Text style={styles.problemText}>Keluhan: {item.keluhan}</Text>
                </View>

                {item.status === 'LUNAS' && (
                  <TouchableOpacity style={styles.receiptButton}>
                    <ReceiptText color="#FFF" size={16} />
                    <Text style={styles.receiptButtonText}>LIHAT STRUK</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { padding: 20, backgroundColor: '#0F172A', borderBottomWidth: 4, borderBottomColor: '#DC2626', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  card: { backgroundColor: '#FFF', marginBottom: 16, borderWidth: 2, borderColor: '#0F172A', borderLeftWidth: 6, borderLeftColor: '#0F172A', elevation: 2, shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.1, shadowRadius: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  dateText: { fontSize: 14, fontWeight: '900', fontStyle: 'italic', color: '#0F172A' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  cardBody: { padding: 16 },
  serviceName: { fontSize: 18, fontWeight: '900', color: '#0F172A', fontStyle: 'italic', marginBottom: 4 },
  vehicleName: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 12 },
  problemText: { fontSize: 14, color: '#334155', fontStyle: 'italic' },
  receiptButton: { backgroundColor: '#0F172A', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  receiptButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900', fontStyle: 'italic' },
});
