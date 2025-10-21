import { create } from 'zustand';
import type { AuthState } from '../types/types';

const users = {
  id: 1,
  nom: "Tovo",
  email: "tovo@gmail.com",
  token: "eyJhbGciOi"
}


export const useAuthStore = create<AuthState>((set) => ({
  user: users,
  modemStatus: { isConnected: false, message: 'Non vérifié', statusCode: 'INIT' },
  isLoading: false,

  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  setModemStatus: (status) => set({ modemStatus: status }),
  setLoading: (loading) => set({ isLoading: loading }),
}));