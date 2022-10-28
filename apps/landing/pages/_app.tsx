import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import '@devclad/ui/fontscss';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<Component {...pageProps} />;
			<Analytics />
		</>
	);
}
