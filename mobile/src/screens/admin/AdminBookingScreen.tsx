import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../utils/api';
import { ReceiptText, AlertCircle } from 'lucide-react-native';

export default function AdminBookingScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return '#EAB308';
      case 'PROSES': return '#3B82F6';
      case 'SELESAI': return '#22C55E';
      case 'LUNAS': return '#10B981';
      case 'BATAL': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SEMUA <Text style={{color: '#DC2626'}}>TRANSAKSI</Text></Text>
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
          {bookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AlertCircle color="#94A3B8" size={48} />
              <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
            </View>
          ) : (
            bookings.map((item, index) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.dateText}>{item.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status.toUpperCase()) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <Text style={styles.customerName}>{item.pelanggan_nama}</Text>
                  <Text style={styles.serviceName}>{item.nama_layanan}</Text>
                  <Text style={styles.vehicleName}>Kendaraan: {item.plat_nomor}</Text>
                  <Text style={styles.dateInfo}>{new Date(item.tanggal_booking).toLocaleString('id-ID')}</Text>
                </View>

                {item.status !== 'Selesai' && (
                  <TouchableOpacity 
                    style={styles.processButton}
                    onPress={() => {
                      // Navigate to Kasir tab and perhaps pre-fill?
                      // For now, just navigate to Kasir.
                      navigation.navigate('Kasir');
                    }}
                  >
                    <ReceiptText color="#FFF" size={16} />
                    <Text style={styles.processButtonText}>PROSES DI KASIR</Text>
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
  card: { backgroundColor: '#FFF', marginBottom: 16, borderWidth: 2, borderColor: '#0F172A', borderLeftWidth: 6, borderLeftColor: '#0F172A', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  dateText: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', color: '#DC2626' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  cardBody: { padding: 16 },
  customerName: { fontSize: 18, fontWeight: '900', color: '#0F172A', fontStyle: 'italic', marginBottom: 4 },
  serviceName: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  vehicleName: { fontSize: 12, fontWeight: 'bold', color: '#64748B', marginBottom: 8 },
  dateInfo: { fontSize: 12, color: '#94A3B8' },
  processButton: { backgroundColor: '#DC2626', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  processButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900', fontStyle: 'italic' },
});
