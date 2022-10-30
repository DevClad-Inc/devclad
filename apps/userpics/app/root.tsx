import { GraphTextureSVG } from '@devclad/ui';
import type { MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import styles from './styles/tailwind.css';

export function links() {
	return [
		{ rel: 'stylesheet', href: styles },
		{
			rel: 'icon',
			href: '/favicon.ico',
			type: 'image/ico',
		},
	];
}

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Userpics by DevClad - Avatars in 1 API Call',
	viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<Meta />
				<Links />
			</head>
			<div style={{ backgroundImage: `url(${GraphTextureSVG})` }} className="h-full bg-black">
				<body
					className="sm:text-md h-full bg-black/80 font-sans
          text-sm font-medium text-white subpixel-antialiased selection:bg-orange-300 selection:text-black
          dark:bg-black/60  lg:text-lg"
				>
					<Outlet />
					<ScrollRestoration />
					<Scripts />
					<LiveReload />
				</body>
			</div>
		</html>
	);
}
