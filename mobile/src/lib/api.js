import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// REPLACE 10.0.2.2 with your machine's LAN IP if testing on physical device (e.g. http://192.168.1.5:5000/api)
// 10.0.2.2 is the special alias for "localhost" on Android Emulator
const API_URL = 'http://192.168.31.55:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Error retrieving token", error);
    }
    return config;
});

export default api;
