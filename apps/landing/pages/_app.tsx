import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Inter, JetBrains_Mono } from '@next/font/google';
import Head from 'next/head';

export const jbMono = JetBrains_Mono({
	variable: '--font-jb-mono',
});

export const inter = Inter({
	variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}
