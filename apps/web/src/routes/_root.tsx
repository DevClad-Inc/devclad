import clsx from 'clsx';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation, ScrollRestoration, Navigate } from 'react-router-dom';
import GraphTexure from '@devclad/ui/assets/svg/graph-texture.svg';
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
  // AUTH CHECK AND REFRESH TOKEN
  React.useEffect(() => {
    if (authed) {
      setInterval(() => {
        refreshToken();
      }, 1000 * 60 * 90); // (lower than 2 hour on the backend)
    }
  }, [authed]);

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
  return (
    <div style={{ backgroundImage: `url(${GraphTexure})` }}>
      <div className={clsx('h-full overflow-x-clip', { dark: darkMode })}>
        <div
          className="sm:text-md bg-white from-black/50
          via-darkBG2 to-black/50
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