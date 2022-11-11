import { Html, Head, Main, NextScript } from 'next/document';
import { inter, jbMono } from '@/pages/_app';

export default function Document() {
	return (
		<Html>
			<Head />
			<body
				className={`scrollbar overflow-x-hidden overflow-y-scroll bg-black ${inter.variable} ${jbMono.variable}`}
			>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
