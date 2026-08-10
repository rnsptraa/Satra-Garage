import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Users, Car, Settings, ChevronRight } from 'lucide-react-native';

export default function AdminDataMenuScreen({ navigation }: any) {
  const menus = [
    { id: 1, title: 'DATA PELANGGAN', desc: 'Kelola informasi member bengkel', icon: Users, route: 'Pelanggan', color: '#3B82F6' },
    { id: 2, title: 'DATA KENDARAAN', desc: 'Daftar garasi motor seluruh pelanggan', icon: Car, route: 'Kendaraan', color: '#DC2626' },
    { id: 3, title: 'DATA LAYANAN', desc: 'Katalog servis dan biaya', icon: Settings, route: 'Layanan', color: '#22C55E' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MASTER <Text style={{color: '#DC2626'}}>DATA</Text></Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionDesc}>Pilih kategori data yang ingin Anda lihat.</Text>

        {menus.map((menu) => (
          <TouchableOpacity 
            key={menu.id} 
            style={styles.menuCard}
            onPress={() => navigation.navigate(menu.route)}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${menu.color}20` }]}>
              <menu.icon color={menu.color} size={32} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>{menu.title}</Text>
              <Text style={styles.menuDesc}>{menu.desc}</Text>
            </View>
            <ChevronRight color="#0F172A" size={24} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { padding: 20, backgroundColor: '#0F172A', borderBottomWidth: 4, borderBottomColor: '#DC2626', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' },
  scrollContent: { padding: 20 },
  sectionDesc: { fontSize: 14, color: '#64748B', fontWeight: 'bold', marginBottom: 20 },
  menuCard: { backgroundColor: '#FFF', padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#0F172A', borderLeftWidth: 6, borderLeftColor: '#0F172A', elevation: 2 },
  iconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', color: '#0F172A', marginBottom: 4 },
  menuDesc: { fontSize: 12, color: '#64748B', fontWeight: 'bold' }
});
