import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Utiliser data-theme au lieu de la classe 'dark'
    root.setAttribute('data-theme', theme);
    console.log('Theme appliqué:', theme)
  }, [theme]);

  return { theme, toggleTheme, setTheme };
};