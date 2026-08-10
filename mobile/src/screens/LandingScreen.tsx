import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Menu, X, CheckCircle2, ChevronRight, MapPin, Phone } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LandingScreen({ navigation }: any) {
  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    { title: 'TUNE UP KOMPETISI', desc: 'Kalibrasi presisi untuk efisiensi dan tenaga maksimal.', price: 'Rp 500.000' },
    { title: 'ENGINE BUILD', desc: 'Perakitan mesin balap dari nol dengan standar sirkuit.', price: 'Rp 2.500.000' },
    { title: 'ECU REMAPPING', desc: 'Buka limit performa bawaan pabrik untuk tenaga instan.', price: 'Rp 750.000' },
  ];

  const partners = [
    { name: 'BRT', img: require('../../assets/brands/brt1.png') },
    { name: 'UMA RACING', img: require('../../assets/brands/uma-racing.png') },
    { name: 'TDR', img: require('../../assets/brands/tdr.png') },
    { name: 'FIM PISTON', img: require('../../assets/brands/fim.png') },
    { name: 'KAWAHARA', img: require('../../assets/brands/kawahara.png') },
    { name: 'KYB', img: require('../../assets/brands/kyb.png') },
    { name: 'DAYTONA', img: require('../../assets/brands/daytona.png') },
    { name: 'YSS', img: require('../../assets/brands/yss.png') }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header / Navbar */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.brandText}>SATRA <Text style={styles.brandTextPrimary}>GARAGE+</Text></Text>
        </View>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>
          {menuOpen ? <X color="#FFF" size={24} /> : <Menu color="#FFF" size={24} />}
        </TouchableOpacity>
      </View>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setMenuOpen(false)}>
            <Text style={styles.menuItemText}>BERANDA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); navigation.navigate('Login'); }}>
            <Text style={styles.menuItemText}>LAYANAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemPrimary]} onPress={() => { setMenuOpen(false); navigation.navigate('Login'); }}>
            <Text style={[styles.menuItemText, { color: '#FFF' }]}>MEMBER LOGIN</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          {/* We use a dark background simulating the image since we don't have the exact hero bg image locally */}
          <View style={styles.heroOverlay}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BENGKEL RACING #1 DI SENTUL</Text>
            </View>
            <Text style={styles.heroTitle}>BENGKELNYA PARA <Text style={styles.textPrimary}>JUARA</Text></Text>
            <Text style={styles.heroDesc}>Tingkatkan performa motormu ke level maksimal. Ditangani mekanik spesialis balap dengan standar sirkuit internasional.</Text>
            
            <View style={styles.heroButtons}>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.btnPrimaryText}>BOOKING SEKARANG</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.btnSecondaryText}>LIHAT LAYANAN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5000+</Text>
            <Text style={styles.statLabel}>PERBAIKAN SUKSES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>25</Text>
            <Text style={styles.statLabel}>MEKANIK CERTIFIED</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statLabel}>KEPUASAN PELANGGAN</Text>
          </View>
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>LAYANAN <Text style={styles.textPrimary}>SIGNATURE</Text></Text>
            <Text style={styles.sectionSubtitle}>Dikerjakan dengan presisi menggunakan alat diagnostik terbaru.</Text>
          </View>

          {services.map((srv, idx) => (
            <View key={idx} style={styles.serviceCard}>
              <View style={styles.serviceIconWrap}>
                <CheckCircle2 color="#DC2626" size={24} />
              </View>
              <Text style={styles.serviceTitle}>{srv.title}</Text>
              <Text style={styles.serviceDesc}>{srv.desc}</Text>
              <View style={styles.serviceFooter}>
                <Text style={styles.servicePrice}>Mulai {srv.price}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <ChevronRight color="#DC2626" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* PARTNERS SECTION */}
        <View style={styles.partnersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>OFFICIAL <Text style={styles.textPrimary}>PARTNERS</Text></Text>
            <Text style={styles.sectionSubtitle}>Suku cadang performa tinggi berstandar kompetisi.</Text>
          </View>

          <View style={styles.partnersGrid}>
            {partners.map((partner, index) => (
              <View key={index} style={styles.partnerLogoBox}>
                <Image source={partner.img} style={styles.partnerImg} resizeMode="contain" />
              </View>
            ))}
          </View>
        </View>

        {/* CTA SECTION */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>BERGABUNG DENGAN KAUM <Text style={styles.textPrimary}>ELITE</Text></Text>
          <Text style={styles.ctaDesc}>Dapatkan diskon khusus member, prioritas antrian, dan histori servis digital selamanya.</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.btnPrimaryText}>DAFTAR SEKARANG</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.brandText}>SATRA <Text style={styles.brandTextPrimary}>GARAGE+</Text></Text>
            <Text style={styles.footerDesc}>Pusat perawatan otomotif premium dengan standar balap untuk kaum elite pecinta kecepatan.</Text>
          </View>
          
          <View style={styles.footerCol}>
            <Text style={styles.footerTitle}>HUBUNGI <Text style={styles.textPrimary}>KAMI</Text></Text>
            <View style={styles.footerContact}>
              <MapPin color="#DC2626" size={16} />
              <Text style={styles.footerContactText}>Jl. Balap No. 99, Sentul</Text>
            </View>
            <View style={styles.footerContact}>
              <Phone color="#DC2626" size={16} />
              <Text style={styles.footerContactText}>+62 812 3456 7890</Text>
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.copyright}>© 2026 SATRA GARAGE+. PERFORMANCE UNLEASHED.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  textPrimary: { color: '#DC2626' },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#1E293B', borderBottomWidth: 4, borderBottomColor: '#DC2626' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 22, fontWeight: '900', fontStyle: 'italic', color: '#FFF' },
  brandTextPrimary: { color: '#DC2626' },
  menuBtn: { padding: 8, backgroundColor: '#DC2626' },
  
  // Mobile Menu
  mobileMenu: { position: 'absolute', top: 76, left: 0, right: 0, backgroundColor: '#1E293B', zIndex: 10, borderBottomWidth: 4, borderBottomColor: '#DC2626' },
  menuItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#334155' },
  menuItemPrimary: { backgroundColor: '#DC2626' },
  menuItemText: { color: '#FFF', fontSize: 16, fontWeight: '900', fontStyle: 'italic', textAlign: 'center' },

  // Hero Section
  heroSection: { backgroundColor: '#0F172A' },
  heroOverlay: { padding: 30, paddingVertical: 60, alignItems: 'center' },
  badge: { backgroundColor: 'rgba(220,38,38,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#DC2626', marginBottom: 20 },
  badgeText: { color: '#DC2626', fontSize: 12, fontWeight: 'bold' },
  heroTitle: { fontSize: 42, fontWeight: '900', fontStyle: 'italic', color: '#FFF', textAlign: 'center', marginBottom: 16 },
  heroDesc: { fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 30, lineHeight: 24, fontWeight: 'bold' },
  heroButtons: { width: '100%', gap: 16 },
  btnPrimary: { backgroundColor: '#DC2626', padding: 18, alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: '900', fontStyle: 'italic' },
  btnSecondary: { backgroundColor: 'transparent', padding: 18, alignItems: 'center', borderWidth: 2, borderColor: '#DC2626' },
  btnSecondaryText: { color: '#DC2626', fontSize: 16, fontWeight: '900', fontStyle: 'italic' },

  // Stats Section
  statsSection: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#DC2626' },
  statBox: { width: '100%', padding: 30, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.1)' },
  statNumber: { fontSize: 48, fontWeight: '900', fontStyle: 'italic', color: '#000' },
  statLabel: { fontSize: 14, fontWeight: '900', color: '#FFF' },

  // Features Section
  featuresSection: { padding: 30, backgroundColor: '#0F172A' },
  sectionHeader: { alignItems: 'center', marginBottom: 40 },
  sectionTitle: { fontSize: 32, fontWeight: '900', fontStyle: 'italic', color: '#FFF', textAlign: 'center' },
  sectionSubtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 10, fontWeight: 'bold' },
  serviceCard: { backgroundColor: '#1E293B', padding: 24, marginBottom: 20, borderWidth: 2, borderColor: '#334155', borderLeftWidth: 6, borderLeftColor: '#DC2626' },
  serviceIconWrap: { backgroundColor: 'rgba(220,38,38,0.1)', width: 48, height: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderRadius: 24 },
  serviceTitle: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: '#FFF', marginBottom: 8 },
  serviceDesc: { fontSize: 14, color: '#94A3B8', marginBottom: 16, lineHeight: 22 },
  serviceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 16 },
  servicePrice: { fontSize: 18, fontWeight: '900', color: '#FFF' },

  // Partners Section
  partnersSection: { padding: 30, backgroundColor: '#F1F5F9' },
  partnersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  partnerLogoBox: { width: width / 2 - 40, height: 80, backgroundColor: 'rgba(15, 23, 42, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  partnerImg: { width: '80%', height: '60%', opacity: 0.6 },

  // CTA Section
  ctaSection: { padding: 40, backgroundColor: '#0F172A', alignItems: 'center', borderTopWidth: 4, borderTopColor: '#DC2626' },
  ctaTitle: { fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: '#FFF', textAlign: 'center', marginBottom: 16 },
  ctaDesc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginBottom: 30, fontWeight: 'bold' },

  // Footer
  footer: { backgroundColor: '#000', padding: 30 },
  footerCol: { marginBottom: 30 },
  footerDesc: { color: '#94A3B8', fontSize: 12, marginTop: 10, lineHeight: 20 },
  footerTitle: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', color: '#FFF', marginBottom: 16, borderBottomWidth: 2, borderBottomColor: '#DC2626', alignSelf: 'flex-start', paddingBottom: 4 },
  footerContact: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  footerContactText: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  footerBottom: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 20, alignItems: 'center' },
  copyright: { color: '#64748B', fontSize: 10, fontWeight: 'bold' }
});
