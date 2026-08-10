import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { LogIn } from 'lucide-react-native';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password tidak boleh kosong!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Cek role
        if (response.data.user.role === 'ADMIN' || response.data.user.role === 'SUPER_ADMIN') {
          navigation.replace('AdminApp');
        } else {
          navigation.replace('MainApp');
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal login, periksa kembali koneksi atau kredensial Anda.';
      Alert.alert('Login Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        <View style={styles.logoContainer}>
          <Text style={styles.brandText}>SATRA <Text style={styles.brandTextPrimary}>GARAGE+</Text></Text>
          <Text style={styles.subBrand}>PERFORMANCE UNLEASHED</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>MEMBER LOGIN</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="pembalap@satra.com"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <View style={styles.buttonContent}>
                <LogIn color="#FFF" size={20} />
                <Text style={styles.buttonText}>START ENGINE</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>BELUM PUNYA AKUN? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>DAFTAR SEKARANG</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 60 },
  brandText: { fontSize: 36, fontWeight: '900', fontStyle: 'italic', color: '#FFF' },
  brandTextPrimary: { color: '#DC2626' },
  subBrand: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 2, marginTop: 4 },
  formContainer: { 
    backgroundColor: '#1E293B', 
    padding: 24, 
    borderWidth: 2, 
    borderColor: '#334155',
    // Mocking skew effect for mobile
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
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  registerLink: { color: '#DC2626', fontSize: 12, fontWeight: 'bold', textDecorationLine: 'underline' }
});
