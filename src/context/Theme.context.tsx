import React, { useMemo, useState } from 'react';

export const ThemeContext = React.createContext({
  darkMode: false,
} as {
  darkMode: boolean;
  toggle: (darkMode: boolean) => void;
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const toggle = (dark:boolean) => {
    setDarkMode(!dark);
    localStorage.setItem('darkMode', JSON.stringify(!dark));
  };
  const value = useMemo(() => ({ darkMode, toggle }), [darkMode]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
