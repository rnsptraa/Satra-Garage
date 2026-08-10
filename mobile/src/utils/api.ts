import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gunakan IP lokal dari komputer yang menjalankan backend (bukan localhost)
export const API_URL = 'http://192.168.1.21:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menambahkan token secara otomatis ke setiap request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
