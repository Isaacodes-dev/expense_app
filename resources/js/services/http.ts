import axios from 'axios';
import router from '@/router';

const http = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
        Accept: 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const status = error.response?.status;

        if (status === 401) {
            router.push({ name: 'login' });
        }

        if (status === 419) {
            window.location.reload();
        }

        return Promise.reject(error);
    },
);

export default http;
