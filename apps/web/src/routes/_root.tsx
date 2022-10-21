import clsx from 'clsx';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation, ScrollRestoration, Navigate } from 'react-router-dom';
import { GraphTextureSVG, DevCladSVG } from '@devclad/ui';
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

function SplashScreen() {
	return (
		// DevCladSVG IN THE CENTER
		<div className="relative overflow-y-auto overflow-x-hidden">
			<div className="relative bg-gradient-to-b from-black via-black/60 to-black">
				<Toaster />
				<div
					className="absolute top-10 -left-2 h-48 w-48 rounded-full bg-sky-900/60
         opacity-50 mix-blend-difference blur-2xl filter"
				/>
				<div
					className="animate-blob absolute top-20 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-orange-900
          via-fuchsia-900/10 to-black opacity-50 mix-blend-difference blur-2xl filter"
				/>
				<div className="relative z-10">
					<div className="flex h-screen items-center justify-center">
						<div className="flex flex-col items-center justify-center">
							<img
								src={DevCladSVG}
								alt="DevClad Logo"
								className="h-72 w-72 animate-pulse sm:h-96 sm:w-96"
							/>
						</div>
					</div>
				</div>
				<div
					className="blob absolute bottom-5 left-1/3 h-96 w-96 rounded-full bg-gradient-to-bl from-sky-900/90
         via-fuchsia-900/10 to-black opacity-80 mix-blend-difference blur-2xl filter"
				/>
				<div className="animate-blob absolute bottom-1/2 right-2 h-96 w-96 rounded-full bg-sky-900/30 opacity-50 mix-blend-difference blur-2xl filter" />
				<div className="animate-dropglow animate-blob absolute bottom-1/2 right-2 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-900/30 via-fuchsia-900/30 to-black opacity-50 mix-blend-difference blur-2xl filter" />
			</div>
		</div>
	);
}

function Routing(): JSX.Element {
	const qc = useQueryClient();
	const { pathname } = useLocation();
	const { authed } = useAuth();
	const { approved } = useApproved();
	const { token, refresh } = useAuth();
	// AUTH CHECK AND REFRESH TOKEN
	React.useEffect(() => {
		if (token && refresh && token !== undefined && refresh !== undefined) {
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
	if (
		(qc.getQueryData(['user']) === null || qc.getQueryData(['user']) === undefined) &&
		qc.getQueryData(['token']) === null
	) {
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
	return <SplashScreen />;
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
