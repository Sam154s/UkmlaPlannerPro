import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

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

// RGB value mappings
const colorValues: Record<string, string> = {
  'purple-600': '147 51 234',
  'blue-600': '37 99 235',
  'blue-500': '59 130 246',
  'rose-500': '244 63 94',
  'red-400': '248 113 113',
  'pink-400': '244 114 182',
  'amber-500': '245 158 11',
  'orange-400': '251 146 60',
  'yellow-400': '250 204 21',
  'emerald-600': '5 150 105',
  'green-600': '22 163 74',
  'teal-500': '20 184 166',
  'pink-600': '219 39 119',
  'fuchsia-600': '192 38 211',
  'pink-500': '236 72 153',
  'gray-700': '55 65 81',
  'gray-600': '75 85 99',
  'gray-500': '107 114 128',
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// Default purple scheme
const defaultScheme = colorSchemes[0];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
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
      const userScheme = user?.colorScheme ? JSON.parse(user.colorScheme as string) : null;
      return userScheme || (saved ? JSON.parse(saved) : defaultScheme);
    }
    return defaultScheme;
  });

  // Apply theme colors to CSS variables using direct RGB values
  const applyThemeColors = (scheme: ColorScheme) => {
    const root = document.documentElement;
    root.style.setProperty('--gradient-from', colorValues[scheme.from]);
    root.style.setProperty('--gradient-via', colorValues[scheme.via || '']);
    root.style.setProperty('--gradient-to', colorValues[scheme.to]);
    root.style.setProperty('--primary', colorValues[scheme.from]);
  };

  // Save theme preference to user profile when logged in
  const saveThemePreference = async (scheme: ColorScheme) => {
    // Always save to localStorage first
    localStorage.setItem('colorScheme', JSON.stringify(scheme));

    // If user is logged in, save to their profile
    if (user) {
      try {
        await apiRequest("PATCH", "/api/user", {
          colorScheme: JSON.stringify(scheme)
        });
        queryClient.setQueryData(["/api/user"], {
          ...user,
          colorScheme: JSON.stringify(scheme)
        });
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (!currentScheme) {
      setCurrentScheme(defaultScheme);
      return;
    }

    // Apply the theme colors immediately
    applyThemeColors(currentScheme);

    // Save the preference
    saveThemePreference(currentScheme);
  }, [currentScheme, user]);

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode: () => setIsDarkMode(!isDarkMode),
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