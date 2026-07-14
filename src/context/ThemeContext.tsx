'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeSettings {
  buttonColor: string;
  boxBgColor: string;
  mainTextColor: string;
  fontFamily: string;
}

interface ThemeContextType {
  theme: ThemeSettings;
  refreshTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Configuración base por defecto para evitar desfases de hidratación (Hydration Mismatch)
  const [theme, setTheme] = useState<ThemeSettings>({
    buttonColor: '#8EB8B2',
    boxBgColor: '#FFFFFF',
    mainTextColor: '#1F2937',
    fontFamily: 'Geist Sans',
  });

  const loadThemeFromStorage = () => {
    if (typeof window !== 'undefined') {
      const button = localStorage.getItem('web_button_color') || '#8EB8B2';
      const boxBg = localStorage.getItem('web_box_bg_color') || '#FFFFFF';
      const text = localStorage.getItem('web_main_text_color') || '#1F2937';
      const font = localStorage.getItem('web_font') || 'Geist Sans';

      setTheme({
        buttonColor: button,
        boxBgColor: boxBg,
        mainTextColor: text,
        fontFamily: font
      });

      // Inyectamos las variables en el documento para que Tailwind o tus CSS globales las lean mediante var()
      const root = document.documentElement;
      root.style.setProperty('--color-brand-btn', button);
      root.style.setProperty('--color-brand-box', boxBg);
      root.style.setProperty('--color-brand-text', text);
      root.style.setProperty('--font-brand', font);
    }
  };

  useEffect(() => {
    // Carga inicial del tema guardado por el usuario administrador
    loadThemeFromStorage();

    // Evento para actualizar en tiempo real si el usuario cambia el diseño en otra pestaña
    window.addEventListener('storage', loadThemeFromStorage);
    return () => window.removeEventListener('storage', loadThemeFromStorage);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, refreshTheme: loadThemeFromStorage }}>
      <div style={{ fontFamily: theme.fontFamily }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado estrictamente dentro de un ThemeProvider');
  }
  return context;
};