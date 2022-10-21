import clsx from 'clsx';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation, ScrollRestoration, Navigate } from 'react-router-dom';
import { GraphTextureSVG } from '@devclad/ui';
import { ThemeContext } from '@/context/Theme.context';
import AppShell from '@/components/AppShell';
import { refreshToken } from '@/services/auth.services';
import { useApproved, useAuth } from '@/services/useAuth.services';
import CommandPalette from '@/components/CommandPalette';

const allowedPaths = [
	'/login',
	'/signup',
	'/forgot-password',
	'/auth/registration/account-confirm-email',
	'/auth/password/reset/confirm',
];

function Routing(): JSX.Element {
	const qc = useQueryClient();
	const { pathname } = useLocation();
	const { authed } = useAuth();
	const { approved } = useApproved();
	const { token, refresh } = useAuth();
	// AUTH CHECK AND REFRESH TOKEN
	React.useEffect(() => {
		if (token !== undefined && refresh !== undefined) {
			qc.setQueryData(['token'], token); // setting data on first load to use in functions
			qc.setQueryData(['refresh'], refresh);
		}
		if (authed) {
			setInterval(() => {
				refreshToken();
			}, 1000 * 60 * 60 * 2); // refresh token every 2 hours
		}
	}, [qc, authed, token, refresh]);

	// UNAUTHED
	if (qc.getQueryData(['user']) === null) {
		if (!allowedPaths.includes(pathname)) {
			return <Navigate to="/login" />;
		}
		return <Outlet />;
	}

	// AUTHED+UNAPPROVED USER
	if (authed && approved === false) {
		if (!pathname.includes('onboarding')) {
			return <Navigate to="/onboarding" />;
		}
		return <Outlet />;
	}

	// AUTHED+APPROVED USER
	if (authed && approved) {
		return (
			<AppShell>
				<Outlet />
			</AppShell>
		);
	}

	return <div />;
}

export default function Root(): JSX.Element {
	// todo: add splash screen
	const { darkMode } = React.useContext(ThemeContext);
	React.useEffect(() => {
		if (!darkMode) {
			document.getElementById('body')?.classList.remove('bg-black');
		} else {
			document.getElementById('body')?.classList.add('bg-black');
		}
	}, [darkMode]);
	// const initialData = useLoaderData() as Awaited<
	// 	ReturnType<ReturnType<typeof initialDataLoader>>
	// >;
	// React.useEffect(() => {
	// 	qc.setQueryData(['initialData'], initialData);
	// 	console.log('initialData', initialData);
	// }, [initialData, qc]);
	return (
		<div style={{ backgroundImage: `url(${GraphTextureSVG})` }}>
			<div className={clsx('h-full overflow-x-clip', { dark: darkMode })}>
				<div
					className="sm:text-md via-darkBG2 bg-white
          from-black/50 to-black/50
          font-sans text-sm font-medium
          subpixel-antialiased selection:bg-orange-300 selection:text-black dark:bg-black/80
          dark:bg-gradient-to-t dark:text-white lg:text-lg"
				>
					<Toaster
						position="top-right"
						toastOptions={{
							duration: 3000,
						}}
					/>
					<ScrollRestoration />
					<CommandPalette />
					<Routing />
				</div>
			</div>
		</div>
	);
}
