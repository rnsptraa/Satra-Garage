import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api from '../utils/api';
import { UserPlus } from 'lucide-react-native';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Semua kolom wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      Alert.alert('Sukses', 'Registrasi berhasil! Silakan login.', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal registrasi.';
      Alert.alert('Registrasi Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.brandText}>SATRA <Text style={styles.brandTextPrimary}>GARAGE+</Text></Text>
            <Text style={styles.subBrand}>NEW MEMBER REGISTRATION</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>DAFTAR MEMBER</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>NAMA LENGKAP</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>NOMOR TELEPON / WA</Text>
              <TextInput
                style={styles.input}
                placeholder="081234567890"
                placeholderTextColor="#64748B"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <UserPlus color="#FFF" size={20} />
                  <Text style={styles.buttonText}>DAFTAR SEKARANG</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>SUDAH PUNYA AKUN? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>LOGIN DI SINI</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingVertical: 40, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  brandText: { fontSize: 32, fontWeight: '900', fontStyle: 'italic', color: '#FFF' },
  brandTextPrimary: { color: '#DC2626' },
  subBrand: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 2, marginTop: 4 },
  formContainer: { 
    backgroundColor: '#1E293B', 
    padding: 24, 
    borderWidth: 2, 
    borderColor: '#334155',
    borderLeftWidth: 8,
    borderLeftColor: '#DC2626',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 5
  },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', fontStyle: 'italic', marginBottom: 24, borderBottomWidth: 2, borderBottomColor: '#DC2626', paddingBottom: 8, alignSelf: 'flex-start' },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: '#0F172A', borderWidth: 2, borderColor: '#334155', color: '#FFF', padding: 16, fontSize: 16, fontWeight: 'bold' },
  button: { backgroundColor: '#DC2626', padding: 18, alignItems: 'center', marginTop: 10, borderWidth: 2, borderColor: '#FFF' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '900', fontStyle: 'italic', marginLeft: 8 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  loginLink: { color: '#DC2626', fontSize: 12, fontWeight: 'bold', textDecorationLine: 'underline' }
});
