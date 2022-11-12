import '@/styles/globals.css';
import '@devclad/ui/fontscss';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}
