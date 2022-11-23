import { Html, Head, Main, NextScript } from 'next/document';
import { inter, jbMono } from '@/pages/_app';

export default function Document() {
	const title = 'DevClad - Network, Build, and Ship rapidly';
	const desc =
		'Social Workspace Platform built for developers. Meet developers 1:1 using AI, build your network, and ship the next best thing.';
	return (
		<Html lang="en">
			<Head>
				<meta charSet="UTF-8" />

				<meta name="description" content={desc} />
				<link rel="icon" type="image/svg+xml" href="/favicon.ico" />
				<meta name="theme-color" content="#010203" />
				<link rel="canonical" href="https://devclad.com/" />
				<meta name="title" content="DevClad - Social Workspace Platform for Developers" />

				{/* <!-- Open Graph / Facebook --> */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://devclad.coc}m/" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={desc} />
				<meta
					property="og:image"
					content="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/677a1e0a-bd95-4e85-7aa3-86287a865f00/public"
				/>

				{/* <!-- Twitter --> */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://devclad.com/" />
				<meta property="twitter:title" content={title} />
				<meta property="twitter:description" content={desc} />
				<meta
					property="twitter:image"
					content="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/677a1e0a-bd95-4e85-7aa3-86287a865f00/public"
				/>
			</Head>
			<body className="scrollbar overflow-x-hidden overflow-y-scroll bg-black">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
