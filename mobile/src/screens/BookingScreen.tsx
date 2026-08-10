import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { CalendarClock } from 'lucide-react-native';

export default function BookingScreen({ navigation }: any) {
  const [layananId, setLayananId] = useState('1'); // Mock layanan ID (ganti dengan dropdown nantinya jika perlu)
  const [kendaraanId, setKendaraanId] = useState('1'); // Mock kendaraan ID
  const [tanggal, setTanggal] = useState('');
  const [keluhan, setKeluhan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!tanggal || !keluhan) {
      Alert.alert('Error', 'Tanggal dan keluhan harus diisi.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/customer/booking', {
        layananId: parseInt(layananId),
        kendaraanId: parseInt(kendaraanId),
        waktu: new Date(tanggal).toISOString(),
        keluhan
      });
      
      Alert.alert('Sukses', 'Booking berhasil dibuat!', [
        { text: 'OK', onPress: () => navigation.navigate('Riwayat') }
      ]);
      setTanggal('');
      setKeluhan('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal membuat booking.';
      Alert.alert('Booking Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BOOKING <Text style={{color: '#DC2626'}}>SERVIS</Text></Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.infoText}>Silakan isi detail booking di bawah ini. Pastikan Anda telah menambahkan kendaraan di garasi Anda terlebih dahulu.</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>TANGGAL & WAKTU (YYYY-MM-DD HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 2026-08-15 10:00"
              placeholderTextColor="#94A3B8"
              value={tanggal}
              onChangeText={setTanggal}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>KELUHAN KENDARAAN</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Jelaskan masalah motor Anda secara detail..."
              placeholderTextColor="#94A3B8"
              value={keluhan}
              onChangeText={setKeluhan}
              multiline
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleBooking} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <View style={styles.buttonContent}>
                <CalendarClock color="#FFF" size={20} />
                <Text style={styles.buttonText}>KIRIM BOOKING</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { padding: 20, backgroundColor: '#0F172A', borderBottomWidth: 4, borderBottomColor: '#DC2626', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' },
  scrollContent: { padding: 20 },
  formCard: { backgroundColor: '#FFF', padding: 20, borderWidth: 2, borderColor: '#0F172A', elevation: 2, shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.1, shadowRadius: 0 },
  infoText: { color: '#475569', fontSize: 13, fontWeight: 'bold', marginBottom: 20, lineHeight: 20 },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#0F172A', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#CBD5E1', color: '#0F172A', padding: 16, fontSize: 16, fontWeight: 'bold' },
  button: { backgroundColor: '#DC2626', padding: 18, alignItems: 'center', marginTop: 10, borderWidth: 2, borderColor: '#0F172A' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
});
