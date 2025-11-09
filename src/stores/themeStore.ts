// src/stores/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { themeState } from '../types/types';

export const useThemeStore = create<themeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // État initial
      
      // Action pour basculer le thème
      toggleTheme: () => {
        set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light' 
        }));
      },

      // Vous pouvez également ajouter une fonction pour définir directement
      setTheme: (newTheme) => {
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);