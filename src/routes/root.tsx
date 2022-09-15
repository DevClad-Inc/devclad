import clsx from 'clsx';
import React, { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { ThemeContext } from '@/context/Theme.context';
import AppShell from '@/components/AppShell';
import Hackathons from '@/components/Hackathons';
import Projects from '@/components/Projects';
import { UserStatus, initialUserStatus } from '@/lib/InterfacesStates.lib';
import { refreshToken } from '@/services/auth.services';
import { getStatus } from '@/services/profile.services';
import useAuth from '@/services/useAuth.services';
import FourOFour from '@/routes/404';
import Home from '@/routes/Home';
import Login from '@/routes/Login';
import { Onboarding, StepOne, StepTwo } from '@/routes/Onboarding';
import { ForgotPassword, PassReset } from '@/routes/PasswordReset';
import {
  Settings, AccountProfile, SocialProfile, Password,
} from '@/routes/Settings';
import Signup from '@/routes/Signup';
import Social from '@/routes/Social';
import VerifyEmail from '@/routes/VerifyEmail';

function Routing(): JSX.Element {
  const { authed, loggedInUser } = useAuth();
  const qc = useQueryClient();

  // AUTH CHECK AND REFRESH TOKEN
  useEffect(() => {
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
    { enabled: loggedInUser.pk !== undefined },
  );
  if ((statusQuery.isSuccess && statusQuery.data !== null)) {
    const { data } = statusQuery;
    userStatus = data.data;
  }

  // CASE 1: UNAPPROVED USER
  if (userStatus && userStatus.approved === false) {
    return (
      <Routes>
        <Route path="*" element={<FourOFour />} />
        <Route path="/" element={<Onboarding />}>
          <Route path="/" element={<StepOne />} />
          <Route path="step-two" element={<StepTwo />} />
        </Route>
        <Route path="forgot-password/" element={<ForgotPassword />} />
        <Route path="auth/registration/account-confirm-email/:key" element={<VerifyEmail loggedIn={false} />} />
        <Route path="auth/password/reset/confirm/:uid/:token/" element={<PassReset />} />
      </Routes>
    );
  }
  // CASE 2: UNAUTHED USER
  if (!authed && qc.getQueryData(['user']) === null) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
        <Route index element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password/" element={<ForgotPassword />} />
        <Route path="auth/registration/account-confirm-email/:key" element={<VerifyEmail loggedIn={false} />} />
        <Route path="auth/password/reset/confirm/:uid/:token/" element={<PassReset />} />
      </Routes>
    );
  }
  // CASE 3: AUTHED USER
  if (authed && userStatus.approved) {
    return (
      <AppShell>
        <Routes>
          <Route path="*" element={<FourOFour />} />
          <Route index element={<Home />} />
          <Route path="social" element={<Social />} />
          <Route path="projects" element={<Projects />} />
          <Route path="hackathons" element={<Hackathons />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<AccountProfile />} />
            <Route path="/settings/social" element={<SocialProfile />} />
            <Route path="/settings/password" element={<Password />} />
          </Route>
          <Route path="auth/registration/account-confirm-email/:key" element={<VerifyEmail loggedIn />} />
        </Routes>
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

  const { darkMode } = useContext(ThemeContext);
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
        <Routing />
      </div>
    </div>
  );
}
