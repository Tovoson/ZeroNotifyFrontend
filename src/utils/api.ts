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
    
    let token = null;

    try {
      
      const authStorage = localStorage.getItem('auth-storage');
      if(authStorage){
        const authData = JSON.parse(authStorage)
        token = authData.state.token
      }
    } catch (error) {
      console.warn('Erreur lecture storage:', error);
    }
    

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
       
    }
    return Promise.reject(error);
  }
);

export default api;