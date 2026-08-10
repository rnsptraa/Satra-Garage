import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogOut, ChevronRight } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    navigation.replace('Login');
  };

  const partners = ['BRT', 'UMA RACING', 'TDR RACING', 'FIM PISTON', 'KAWAHARA'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, Pembalap!</Text>
          <Text style={styles.userName}>{userData?.name || 'Tamu'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut color="#FFF" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>SIAPKAN MESINMU!</Text>
          <Text style={styles.heroDesc}>Booking servis sekarang tanpa antri panjang. Rasakan performa layaknya motor balap sungguhan.</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('Booking')}>
            <Text style={styles.heroBtnText}>BOOKING SEKARANG</Text>
            <ChevronRight color="#FFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* Partners Section */}
        <View style={styles.partnersSection}>
          <Text style={styles.sectionTitle}>OFFICIAL <Text style={{color: '#DC2626'}}>PARTNERS</Text></Text>
          <View style={styles.partnersGrid}>
            {partners.map((partner, index) => (
              <View key={index} style={styles.partnerCard}>
                <Text style={styles.partnerText}>{partner}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#0F172A', borderBottomWidth: 4, borderBottomColor: '#DC2626' },
  greeting: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  userName: { color: '#FFF', fontSize: 18, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' },
  logoutBtn: { backgroundColor: '#DC2626', p: 8, padding: 8, borderRadius: 50 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heroCard: { backgroundColor: '#1E293B', padding: 24, borderWidth: 2, borderColor: '#334155', borderLeftWidth: 8, borderLeftColor: '#DC2626', marginBottom: 30 },
  heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', fontStyle: 'italic', marginBottom: 10 },
  heroDesc: { color: '#94A3B8', fontSize: 14, fontWeight: 'bold', marginBottom: 20, lineHeight: 20 },
  heroBtn: { backgroundColor: '#DC2626', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 2, borderColor: '#FFF' },
  heroBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900', fontStyle: 'italic' },
  partnersSection: { marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', marginBottom: 16, color: '#0F172A' },
  partnersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  partnerCard: { backgroundColor: '#FFF', width: '45%', padding: 16, borderWidth: 2, borderColor: '#0F172A', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.1, shadowRadius: 0 },
  partnerText: { fontSize: 14, fontWeight: '900', fontStyle: 'italic', color: '#0F172A', textAlign: 'center' }
});
