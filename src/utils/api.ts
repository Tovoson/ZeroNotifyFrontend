import axios from 'axios';
import { useAuthStore } from '../stores/authStore'; // Importer l'état global

// L'URL de base de votre API Express.js
// Assurez-vous d'adapter le port (ex: 3000, 8080)
const API_BASE_URL = 'http://localhost:3000/zeronotify'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur de requêtes Axios
 * Ajoute le jeton JWT (Bearer Token) à l'en-tête de chaque requête sortante.
 */
api.interceptors.request.use(
  (config) => {
    // Récupère l'état actuel de l'utilisateur (et donc du token)
    const token = useAuthStore.getState().user?.token;

    if (token) {
      // Si un token existe, l'ajouter à l'en-tête Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses Axios
 * Gère automatiquement le cas où le token expire (401 Unauthorized).
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Si nous recevons une erreur 401 et que ce n'est pas la requête de connexion
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Déconnecte l'utilisateur dans l'état global
      useAuthStore.getState().logout();
      
      // Optionnel: Rediriger l'utilisateur vers la page de connexion
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;