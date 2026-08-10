import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Car } from 'lucide-react-native';
import api from '../../utils/api';

export default function AdminKendaraanScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/admin/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchVehicles();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DATA <Text style={{color: '#DC2626'}}>KENDARAAN</Text></Text>
        <View style={{width: 24}} />
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
          {vehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Car color="#94A3B8" size={48} />
              <Text style={styles.emptyText}>Belum ada data kendaraan.</Text>
            </View>
          ) : (
            vehicles.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.platText}>{item.plat_nomor}</Text>
                  <Text style={styles.vehicleText}>{item.merk} {item.tipe} ({item.tahun})</Text>
                  <Text style={styles.ownerText}>Pemilik: {item.pemilik}</Text>
                </View>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#0F172A', borderBottomWidth: 4, borderBottomColor: '#DC2626' },
  backBtn: { padding: 4 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  card: { backgroundColor: '#FFF', padding: 16, marginBottom: 12, borderWidth: 2, borderColor: '#0F172A', borderLeftWidth: 6, borderLeftColor: '#DC2626', elevation: 2 },
  cardInfo: { flex: 1 },
  platText: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: '#0F172A', marginBottom: 4 },
  vehicleText: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 8 },
  ownerText: { fontSize: 14, fontWeight: '900', color: '#DC2626' }
});
