import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false,
});

// Intercepteur pour gérer les tokens et erreurs
api.interceptors.request.use(config => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Helpers pratiques
export const formatPriceFcfa = (amount) =>
    new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';

export const formatPriceEuro = (amount) =>
    new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(amount) + ' €';

export const TAUX_AIB = 0.05;

export const calculatePrices = (prixFcfa, prixEuro) => {
    const aibFcfa = prixFcfa * TAUX_AIB;
    const aibEuro = prixEuro * TAUX_AIB;
    return {
        prixHtFcfa: prixFcfa,
        prixHtEuro: prixEuro,
        aibFcfa,
        aibEuro,
        ttcFcfa: prixFcfa + aibFcfa,
        ttcEuro: prixEuro + aibEuro,
        tauxAib: TAUX_AIB,
    };
};