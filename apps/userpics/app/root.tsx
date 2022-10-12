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
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="h-full bg-black text-white">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
