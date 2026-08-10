import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogOut, Search, CheckCircle2, Printer } from 'lucide-react-native';
import api from '../../utils/api';

export default function AdminKasirScreen({ navigation }: any) {
  const [bookingCode, setBookingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    navigation.replace('Login');
  };

  const handleSearch = async () => {
    if (!bookingCode) {
      Alert.alert('Error', 'Masukkan kode booking terlebih dahulu!');
      return;
    }

    setLoading(true);
    setBookingData(null);
    setReceipt(null);
    try {
      const response = await api.get(`/booking/${bookingCode}`);
      setBookingData(response.data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Booking tidak ditemukan.';
      Alert.alert('Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    setPaying(true);
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      const adminId = userDataStr ? JSON.parse(userDataStr).id : 1;
      
      const response = await api.post(`/booking/${bookingCode}/pay`, {
        admin_id: adminId,
        total_bayar: bookingData.harga,
        metode_pembayaran: 'Tunai'
      });
      
      setReceipt({
        ...bookingData,
        transaksiId: response.data.transaksiId,
        tanggalBayar: new Date().toISOString()
      });
      setBookingData(null);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal memproses pembayaran.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setPaying(false);
    }
  };

  const handlePay = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Selesaikan dan proses pembayaran untuk booking ini?');
      if (confirmed) {
        processPayment();
      }
    } else {
      Alert.alert('Konfirmasi', 'Selesaikan dan proses pembayaran untuk booking ini?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Proses Pembayaran', onPress: processPayment }
      ]);
    }
  };

  const printReceipt = () => {
    if (Platform.OS === 'web') {
      window.print();
    } else {
      Alert.alert('Info', 'Fitur cetak fisik (Bluetooth Printer) akan segera hadir untuk aplikasi mobile!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.brandText}>SATRA <Text style={styles.textPrimary}>GARAGE+</Text></Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut color="#FFF" size={20} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>MANAJEMEN TRANSAKSI</Text>
            <Text style={styles.cardDesc}>Masukkan Kode Unik Booking (contoh: BKG-A1B2C3) untuk mengatur status dan pembayaran pelanggan.</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Kode Booking"
                placeholderTextColor="#64748B"
                value={bookingCode}
                onChangeText={setBookingCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Search color="#FFF" size={24} />}
              </TouchableOpacity>
            </View>
          </View>

          {bookingData && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>DETAIL BOOKING</Text>
                <View style={[styles.statusBadge, { backgroundColor: bookingData.status === 'Selesai' ? '#22C55E' : '#EAB308' }]}>
                  <Text style={styles.statusText}>{bookingData.status.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.resultRow}><Text style={styles.resultLabel}>KODE BKG</Text><Text style={styles.resultValue}>{bookingData.id}</Text></View>
              <View style={styles.resultRow}><Text style={styles.resultLabel}>PELANGGAN</Text><Text style={styles.resultValue}>{bookingData.pelanggan_nama}</Text></View>
              <View style={styles.resultRow}><Text style={styles.resultLabel}>KENDARAAN</Text><Text style={styles.resultValue}>{bookingData.merk} {bookingData.tipe} ({bookingData.plat_nomor})</Text></View>
              <View style={styles.resultRow}><Text style={styles.resultLabel}>LAYANAN</Text><Text style={styles.resultValue}>{bookingData.nama_layanan}</Text></View>
              <View style={styles.resultRow}><Text style={styles.resultLabel}>TANGGAL</Text><Text style={styles.resultValue}>{new Date(bookingData.tanggal_booking).toLocaleString('id-ID')}</Text></View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>TOTAL BIAYA</Text>
                <Text style={styles.priceValue}>Rp {Number(bookingData.harga).toLocaleString('id-ID')}</Text>
              </View>

              {bookingData.status !== 'Selesai' && (
                <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={paying}>
                  {paying ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <CheckCircle2 color="#FFF" size={20} />
                      <Text style={styles.payBtnText}>PROSES & LUNASKAN</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {receipt && (
            <View style={styles.receiptCard}>
              <View style={styles.receiptHeader}>
                <Text style={styles.receiptBrand}>SATRA <Text style={styles.textPrimary}>GARAGE+</Text></Text>
                <Text style={styles.receiptAddress}>Jl. Balap No. 99, Jakarta</Text>
                <Text style={styles.receiptAddress}>Telp: 0812-3456-7890</Text>
              </View>

              <View style={styles.receiptDetails}>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>TANGGAL:</Text><Text style={styles.receiptValue}>{new Date(receipt.tanggalBayar).toLocaleDateString('id-ID')}</Text></View>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>WAKTU:</Text><Text style={styles.receiptValue}>{new Date(receipt.tanggalBayar).toLocaleTimeString('id-ID')}</Text></View>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>KASIR:</Text><Text style={styles.receiptValue}>ADMIN</Text></View>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>KODE BKG:</Text><Text style={styles.receiptValue}>{receipt.id}</Text></View>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>NO. TRX:</Text><Text style={styles.receiptValue}>{receipt.transaksiId.substring(0, 8).toUpperCase()}</Text></View>
              </View>

              <View style={styles.receiptService}>
                <Text style={styles.receiptServiceTitle}>{receipt.nama_layanan}</Text>
                <Text style={styles.receiptServiceDesc}>{receipt.merk} {receipt.tipe} ({receipt.plat_nomor})</Text>
              </View>

              <View style={styles.receiptTotal}>
                <Text style={styles.receiptTotalLabel}>TOTAL:</Text>
                <Text style={styles.receiptTotalValue}>Rp {Number(receipt.harga).toLocaleString('id-ID')}</Text>
              </View>

              <View style={styles.receiptFooter}>
                <Text style={styles.receiptFooterText}>TERIMA KASIH</Text>
                <Text style={styles.receiptFooterSub}>Pilihan tepat kaum elite pecinta kecepatan.</Text>
              </View>

              <TouchableOpacity style={styles.printBtn} onPress={printReceipt}>
                <Printer color="#FFF" size={20} />
                <Text style={styles.printBtnText}>CETAK STRUK FISIK</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#1E293B', borderBottomWidth: 4, borderBottomColor: '#DC2626' },
  greeting: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  brandText: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', color: '#FFF' },
  textPrimary: { color: '#DC2626' },
  logoutBtn: { backgroundColor: '#DC2626', padding: 10, borderRadius: 50 },
  scrollContent: { padding: 20 },
  
  card: { backgroundColor: '#1E293B', padding: 24, borderWidth: 2, borderColor: '#334155', borderLeftWidth: 8, borderLeftColor: '#DC2626', marginBottom: 20 },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: '900', fontStyle: 'italic', marginBottom: 8 },
  cardDesc: { color: '#94A3B8', fontSize: 14, fontWeight: 'bold', marginBottom: 20, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, backgroundColor: '#0F172A', borderWidth: 2, borderColor: '#334155', color: '#FFF', padding: 16, fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
  searchBtn: { backgroundColor: '#DC2626', padding: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },

  resultCard: { backgroundColor: '#F8FAFC', padding: 20, borderWidth: 2, borderColor: '#0F172A' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#E2E8F0', paddingBottom: 16, marginBottom: 16 },
  resultTitle: { color: '#0F172A', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  resultLabel: { color: '#64748B', fontSize: 12, fontWeight: 'bold' },
  resultValue: { color: '#0F172A', fontSize: 14, fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 10 },
  priceContainer: { backgroundColor: '#1E293B', padding: 16, marginTop: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  priceValue: { color: '#DC2626', fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
  payBtn: { backgroundColor: '#DC2626', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderWidth: 2, borderColor: '#0F172A' },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900', fontStyle: 'italic' },

  // Receipt Styles
  receiptCard: { backgroundColor: '#FFF', padding: 30, borderWidth: 4, borderColor: '#000', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2, shadowRadius: 0, elevation: 5 },
  receiptHeader: { alignItems: 'center', borderBottomWidth: 2, borderStyle: 'dashed', borderBottomColor: '#000', paddingBottom: 20, marginBottom: 20 },
  receiptBrand: { fontSize: 24, fontWeight: '900', fontStyle: 'italic', color: '#000', marginBottom: 4 },
  receiptAddress: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  receiptDetails: { marginBottom: 20 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  receiptLabel: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  receiptValue: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  receiptService: { borderTopWidth: 2, borderBottomWidth: 2, borderStyle: 'dashed', borderColor: '#000', paddingVertical: 16, marginBottom: 20 },
  receiptServiceTitle: { fontSize: 16, fontWeight: '900', color: '#000', textTransform: 'uppercase' },
  receiptServiceDesc: { fontSize: 10, color: '#475569', textTransform: 'uppercase', marginTop: 4 },
  receiptTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  receiptTotalLabel: { fontSize: 18, fontWeight: '900', color: '#000' },
  receiptTotalValue: { fontSize: 18, fontWeight: '900', color: '#000' },
  receiptFooter: { alignItems: 'center', borderTopWidth: 2, borderStyle: 'dashed', borderTopColor: '#000', paddingTop: 20, marginBottom: 30 },
  receiptFooterText: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  receiptFooterSub: { fontSize: 10, color: '#475569', marginTop: 4 },
  printBtn: { backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 },
  printBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
});
