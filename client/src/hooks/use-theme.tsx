import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ColorScheme = {
  name: string;
  from: string;
  via?: string;
  to: string;
};

export const colorSchemes: ColorScheme[] = [
  { name: 'Purple (Default)', from: 'purple-600', via: 'blue-600', to: 'blue-500' },
  { name: 'Red', from: 'rose-500', via: 'red-400', to: 'pink-400' },
  { name: 'Orange', from: 'amber-500', via: 'orange-400', to: 'yellow-400' },
  { name: 'Green', from: 'emerald-600', via: 'green-600', to: 'teal-500' },
  { name: 'Pink', from: 'pink-600', via: 'fuchsia-600', to: 'pink-500' },
  { name: 'Monochrome', from: 'gray-700', via: 'gray-600', to: 'gray-500' },
];

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [currentScheme, setCurrentScheme] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colorScheme');
      return saved ? JSON.parse(saved) : colorSchemes[0];
    }
    return colorSchemes[0];
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('colorScheme', JSON.stringify(currentScheme));
    // Update CSS variables for the gradient
    document.documentElement.style.setProperty('--gradient-from', `var(--${currentScheme.from})`);
    document.documentElement.style.setProperty('--gradient-via', currentScheme.via ? `var(--${currentScheme.via})` : '');
    document.documentElement.style.setProperty('--gradient-to', `var(--${currentScheme.to})`);
  }, [currentScheme]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      currentScheme,
      setColorScheme: setCurrentScheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}