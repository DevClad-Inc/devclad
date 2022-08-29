import Cookies from 'js-cookie';
import React, { useMemo, useState } from 'react';

export const ThemeContext = React.createContext({
  darkMode: false,
} as {
  darkMode: boolean;
  toggle: (darkMode: boolean) => void;
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(JSON.parse(Cookies.get('darkMode') || 'false'));
  const toggle = (dark:boolean) => {
    setDarkMode(!dark);
    Cookies.set('darkMode', String(!dark), {
      expires: 365,
      secure: true,
      sameSite: 'lax',
    });
  };
  const value = useMemo(() => ({ darkMode, toggle }), [darkMode]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
