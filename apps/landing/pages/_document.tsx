import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head />
			<body className="scrollbar overflow-x-hidden overflow-y-scroll bg-black">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
