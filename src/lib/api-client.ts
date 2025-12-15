import axios from 'axios';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from 'sonner';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        console.groupCollapsed(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log("Status:", response.status);
        console.log("Data:", response.data);
        console.groupEnd();
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
                toast.error("Session expired. Please login again.");
            }
        }
        return Promise.reject(error);
    }
);
