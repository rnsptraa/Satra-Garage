import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Users } from 'lucide-react-native';
import api from '../../utils/api';

export default function AdminPelangganScreen({ navigation }: any) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCustomers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DATA <Text style={{color: '#DC2626'}}>PELANGGAN</Text></Text>
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
          {customers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Users color="#94A3B8" size={48} />
              <Text style={styles.emptyText}>Belum ada data pelanggan.</Text>
            </View>
          ) : (
            customers.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.nameText}>{item.nama}</Text>
                  <Text style={styles.contactText}>{item.email} • {item.no_telepon}</Text>
                  <Text style={styles.dateText}>Bergabung: {new Date(item.createdAt).toLocaleDateString('id-ID')}</Text>
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
  card: { backgroundColor: '#FFF', padding: 16, marginBottom: 12, borderWidth: 2, borderColor: '#0F172A', borderLeftWidth: 6, borderLeftColor: '#3B82F6', elevation: 2 },
  cardInfo: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: '900', fontStyle: 'italic', color: '#0F172A', marginBottom: 4 },
  contactText: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 8 },
  dateText: { fontSize: 12, color: '#94A3B8' }
});
