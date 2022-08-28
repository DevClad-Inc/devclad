import { get, set } from 'idb-keyval';
import React, { useMemo, useState } from 'react';

export const ThemeContext = React.createContext({
  darkMode: false,
} as {
  darkMode: boolean;
  toggle: (darkMode: boolean) => void;
});

async function getDarkMode(): Promise<any> {
  const darkModeVal = await get('darkMode');
  return darkModeVal;
}

const darkModeVal = await getDarkMode();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(darkModeVal);
  const toggle = (dark:boolean) => {
    setDarkMode(!dark);
    set('darkMode', !dark);
  };
  const value = useMemo(() => ({ darkMode, toggle }), [darkMode]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
