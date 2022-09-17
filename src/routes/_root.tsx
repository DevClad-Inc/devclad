import clsx from 'clsx';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Routes, Route, Outlet, useNavigate, useLocation, ScrollRestoration,
} from 'react-router-dom';
import { ThemeContext } from '@/context/Theme.context';
import AppShell from '@/components/AppShell';
import { UserStatus, initialUserStatus } from '@/lib/InterfacesStates.lib';
import { refreshToken } from '@/services/auth.services';
import { getStatus } from '@/services/profile.services';
import useAuth from '@/services/useAuth.services';
import Login from '@/routes/Login';
import { ForgotPassword, PassReset } from '@/routes/PasswordReset';
import Signup from '@/routes/Signup';
import VerifyEmail from '@/routes/VerifyEmail';

function Routing(): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { authed, loggedInUser } = useAuth();
  const qc = useQueryClient();
  // AUTH CHECK AND REFRESH TOKEN
  React.useEffect(() => {
    if (authed) {
      setInterval(
        () => { refreshToken(); },
        1000 * 60 * 60,
      );
    }
  }, [loggedInUser]);

  // USER STATUS
  let userStatus: UserStatus = { ...initialUserStatus };
  const statusQuery = useQuery(
    ['userStatus'],
    () => getStatus(),
    {
      enabled: loggedInUser.pk !== undefined,
    },
  );
  if ((statusQuery.isSuccess && statusQuery.data !== null)) {
    const { data } = statusQuery as { data: { data: UserStatus } };
    userStatus = data.data;
  }

  // CASE 1: UNAUTHED USER
  if (!authed && qc.getQueryData(['user']) === null) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
        <Route index element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password/" element={<ForgotPassword />} />
        <Route path="auth/registration/account-confirm-email/:key" element={<VerifyEmail />} />
        <Route path="auth/password/reset/confirm/:uid/:token/" element={<PassReset />} />
      </Routes>
    );
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

  return (
    <>
    </>
  );
}

export default function Root(): JSX.Element {
  // todo: add splash screen
  const { darkMode } = React.useContext(ThemeContext);
  return (
    <div className={clsx('h-screen', { dark: darkMode })}>
      <div
        className="h-screen overflow-y-auto overflow-x-hidden scrollbar bg-whitewhite dark:bg-darkBG dark:text-white"
      >
        <Toaster
          position="top-right"
          toastOptions={
            {
              duration: 3000,
            }
        }
        />
        <ScrollRestoration />
        <Routing />
      </div>
    </div>
  );
}
