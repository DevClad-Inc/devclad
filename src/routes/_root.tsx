import clsx from 'clsx';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Outlet, useNavigate, useLocation, ScrollRestoration } from 'react-router-dom';
import { ThemeContext } from '@/context/Theme.context';
import AppShell from '@/components/AppShell';
import { UserStatus, initialUserStatus } from '@/lib/InterfacesStates.lib';
import { refreshToken } from '@/services/auth.services';
import { getStatus } from '@/services/profile.services';
import useAuth from '@/services/useAuth.services';
import CommandPalette from '@/components/CommandPalette';

const allowedPaths = [
  '/login',
  '/signup',
  '/forgot-password',
  '/auth/registration/account-confirm-email',
  '/auth/password/reset/confirm',
];

function Routing(): JSX.Element {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { pathname } = useLocation();
  const { authed, loggedInUser } = useAuth();
  // AUTH CHECK AND REFRESH TOKEN
  React.useEffect(() => {
    if (authed) {
      setInterval(() => {
        refreshToken();
      }, 1000 * 60 * 60);
    }
  }, [loggedInUser]);

  // USER STATUS
  let userStatus: UserStatus = { ...initialUserStatus };
  const statusQuery = useQuery(['userStatus'], () => getStatus(), {
    enabled: loggedInUser.pk !== undefined,
  });
  if (statusQuery.isSuccess && statusQuery.data !== null) {
    const { data } = statusQuery as { data: { data: UserStatus } };
    userStatus = data.data;
  }

  // CASE 1: UNAUTHED
  if (!authed && qc.getQueryData(['user']) === null) {
    if (!allowedPaths.includes(pathname)) {
      navigate('/login');
    }
    return <Outlet />;
  }

  // CASE 2: AUTHED+UNAPPROVED USER
  if (authed && userStatus.approved === false) {
    if (!pathname.includes('onboarding')) {
      navigate('/onboarding');
    }
    return <Outlet />;
  }

  // CASE 3: AUTHED+APPROVED USER
  if (authed && userStatus.approved) {
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
    <div className="bg-[url('./assets/graph-paper.svg')]">
      <div className={clsx('h-full overflow-x-clip', { dark: darkMode })}>
        <div
          className="font-sans font-medium subpixel-antialiased
          text-sm sm:text-md lg:text-lg
          dark:bg-gradient-to-t from-black/50 via-darkBG2 to-black/50
          bg-white dark:bg-black/80 dark:text-white"
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
