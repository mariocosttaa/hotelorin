import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getTheme, setThemeDark, setThemeLight } from '@/js/shared/cookies/theme';

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = getTheme();
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setThemeDark();
    } else {
      document.documentElement.classList.remove('dark');
      setThemeLight();
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      setThemeDark();
    } else {
      document.documentElement.classList.remove('dark');
      setThemeLight();
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
