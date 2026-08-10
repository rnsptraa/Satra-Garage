import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { Car, Plus, Trash2 } from 'lucide-react-native';

export default function VehicleScreen() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for new vehicle
  const [platNomor, setPlatNomor] = useState('');
  const [merek, setMerek] = useState('');
  const [model, setModel] = useState('');
  const [tahun, setTahun] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchVehicles = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      const userId = userDataStr ? JSON.parse(userDataStr).id : 1;
      const response = await api.get(`/customer/vehicles/${userId}`);
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

  const handleAddVehicle = async () => {
    if (!platNomor || !merek || !model || !tahun) {
      Alert.alert('Error', 'Semua data kendaraan harus diisi.');
      return;
    }

    setAdding(true);
    try {
      await api.post('/customer/kendaraan', { platNomor, merek, model, tahun: parseInt(tahun) });
      Alert.alert('Sukses', 'Kendaraan berhasil ditambahkan.');
      setPlatNomor(''); setMerek(''); setModel(''); setTahun('');
      fetchVehicles();
    } catch (error: any) {
      Alert.alert('Gagal', error.response?.data?.message || 'Gagal menambahkan kendaraan.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Konfirmasi', 'Hapus kendaraan ini dari garasi?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Hapus', 
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/customer/kendaraan/${id}`);
            fetchVehicles();
          } catch (error) {
            Alert.alert('Gagal', 'Tidak dapat menghapus kendaraan.');
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GARASI <Text style={{color: '#DC2626'}}>KENDARAAN</Text></Text>
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
          {/* Add Vehicle Form */}
          <View style={styles.addForm}>
            <Text style={styles.sectionTitle}>TAMBAH KENDARAAN BARU</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.label}>PLAT NOMOR</Text>
                <TextInput style={styles.input} placeholder="B 1234 XYZ" value={platNomor} onChangeText={setPlatNomor} autoCapitalize="characters" />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.label}>TAHUN</Text>
                <TextInput style={styles.input} placeholder="2020" value={tahun} onChangeText={setTahun} keyboardType="number-pad" />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.label}>MEREK</Text>
                <TextInput style={styles.input} placeholder="Honda" value={merek} onChangeText={setMerek} />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.label}>MODEL</Text>
                <TextInput style={styles.input} placeholder="CBR 150R" value={model} onChangeText={setModel} />
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle} disabled={adding}>
              {adding ? <ActivityIndicator color="#FFF" /> : (
                <>
                  <Plus color="#FFF" size={20} />
                  <Text style={styles.addButtonText}>TAMBAH KE GARASI</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Vehicle List */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>KENDARAAN ANDA</Text>
          
          {vehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Car color="#94A3B8" size={48} />
              <Text style={styles.emptyText}>Belum ada kendaraan di garasi.</Text>
            </View>
          ) : (
            vehicles.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.platNomor}>{item.platNomor}</Text>
                  <Text style={styles.vehicleName}>{item.merek} {item.model} ({item.tahun})</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Trash2 color="#EF4444" size={24} />
                </TouchableOpacity>
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
  emptyContainer: { alignItems: 'center', marginTop: 40, padding: 20, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#CBD5E1', borderStyle: 'dashed' },
  emptyText: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', marginBottom: 12, color: '#0F172A' },
  addForm: { backgroundColor: '#FFF', padding: 20, borderWidth: 2, borderColor: '#0F172A', elevation: 2, shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.1, shadowRadius: 0, marginBottom: 20 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputWrapper: { },
  label: { fontSize: 10, fontWeight: 'bold', color: '#64748B', marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', padding: 12, fontSize: 14, fontWeight: 'bold' },
  addButton: { backgroundColor: '#DC2626', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, marginTop: 8 },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900', fontStyle: 'italic' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, marginBottom: 12, borderWidth: 2, borderColor: '#0F172A', borderLeftWidth: 6, borderLeftColor: '#DC2626' },
  cardInfo: { flex: 1 },
  platNomor: { fontSize: 20, fontWeight: '900', color: '#0F172A', fontStyle: 'italic', marginBottom: 4 },
  vehicleName: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  deleteButton: { padding: 8 }
});
