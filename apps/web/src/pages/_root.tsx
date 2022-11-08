import React from 'react';
import Cookies from 'js-cookie';
import { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation, ScrollRestoration, Navigate } from 'react-router-dom';
import { GraphTextureSVG } from '@devclad/ui';
import { classNames } from '@devclad/lib';
import { ThemeContext } from '@/context/Theme.context';
import Layout from '@/pages/Layout';
import { checkTokenType, refreshToken } from '@/services/auth.services';
import { useApproved, useAuth } from '@/services/useAuth.services';
import CommandPalette from '@/components/CommandPalette';
import SplashScreen from '@/pages/Splash';

export const allowedPaths = ['/login', '/signup', '/forgot-password'];

function Routing(): JSX.Element {
	const qc = useQueryClient();
	const { pathname } = useLocation();
	const { authed } = useAuth();
	const { approved } = useApproved();
	const { token, refresh } = useAuth();
	const loggedInCookie = Cookies.get('loggedIn');
	React.useEffect(() => {
		// ! need this for login
		if (checkTokenType(token) && checkTokenType(refresh)) {
			qc.setQueryData(['token'], token);
			qc.setQueryData(['refresh'], refresh);
		}
		if (authed) {
			setInterval(() => {
				refreshToken(qc);
			}, 1000 * 60 * 60 * 2);
		}
	}, [qc, authed, token, refresh]);

	const unauthed = !authed && !loggedInCookie;
	const authedAndUnApproved =
		authed && !approved && qc.getQueryState(['userStatus'])?.status === 'success';
	const authedAndApproved =
		authed && approved && qc.getQueryState(['userStatus'])?.status === 'success';

	switch (true) {
		case unauthed && !allowedPaths.includes(pathname) && !pathname.includes('/auth/'):
			return <Navigate to="/login" />;
		case unauthed && (allowedPaths.includes(pathname) || pathname.includes('/auth/')):
			return <Outlet />;
		case authedAndUnApproved && !pathname.includes('/onboarding'):
			return <Navigate to="/onboarding" />;
		case authedAndUnApproved && pathname.includes('/onboarding'):
			return <Outlet />;
		case authedAndApproved:
			return (
				<Layout>
					<Outlet />
				</Layout>
			);
		default:
			return <SplashScreen />;
	}
}

export default function Root(): JSX.Element {
	const { darkMode } = React.useContext(ThemeContext);
	React.useEffect(() => {
		if (!darkMode) {
			document.getElementById('body')?.classList.remove('bg-black');
		} else {
			document.getElementById('body')?.classList.add('bg-black');
		}
	}, [darkMode]);
	return (
		<div style={{ backgroundImage: `url(${GraphTextureSVG})` }}>
			<div className={classNames(darkMode ? 'dark' : '', 'h-full overflow-x-clip')}>
				<div
					className="sm:text-md via-darkBG2 bg-white
          from-black/50 to-black/50
          font-sans text-sm font-medium
          subpixel-antialiased selection:bg-orange-200 selection:text-black dark:bg-black/80
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
