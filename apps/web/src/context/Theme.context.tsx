import Cookies from 'js-cookie';
import React, { useMemo, useState } from 'react';
import { DEVELOPMENT } from '@/services/auth.services';

export const ThemeContext = React.createContext({
	darkMode: true,
} as {
	darkMode: boolean;
	toggle: (darkMode: boolean) => void;
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [darkMode, setDarkMode] = useState(JSON.parse(Cookies.get('darkMode') || 'true'));
	const toggle = (dark: boolean) => {
		setDarkMode(!dark);
		Cookies.set('darkMode', String(!dark), {
			expires: 365,
			secure: !DEVELOPMENT,
			sameSite: 'lax',
		});
	};
	const value = useMemo(() => ({ darkMode, toggle }), [darkMode]);
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
