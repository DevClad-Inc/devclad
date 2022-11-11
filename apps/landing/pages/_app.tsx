import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Inter, JetBrains_Mono } from '@next/font/google';

export const jbMono = JetBrains_Mono({
	variable: '--font-jb-mono',
});

export const inter = Inter({
	variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}
