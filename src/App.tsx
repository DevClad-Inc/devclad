import React, { useContext, useEffect } from 'react';
import {
  Routes, Route,
} from 'react-router-dom';
import { clsx } from 'clsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeContext } from './context/Theme.context';
import {
  UserStatus, initialUserStatus,
} from './lib/InterfacesStates.lib';
import { refreshToken } from '@/services/auth.services';
import { getStatus } from '@/services/profile.services';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import {
  Settings, AccountProfile,
  SocialProfile, Password,
} from './components/Settings';
import AppShell from './components/AppShell';
import FourOFour from './components/404';
import Social from './components/Social';
import Projects from './components/Projects';
import Hackathons from './components/Hackathons';
import VerifyEmail from './components/VerifyEmail';
import { PassReset, ForgotPassword } from './components/PasswordReset';
import { Onboarding, StepOne, StepTwo } from './components/Onboarding';
import useAuth from '@/services/useAuth.services';

function App(): JSX.Element {
  const { darkMode } = useContext(ThemeContext);
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

  // todo: add splash screen
  if (userStatus && userStatus.approved === false) {
    return (
      <div className={clsx('App', { dark: darkMode })}>
        <div className="App h-screen overflow-y-auto overflow-x-hidden scrollbar bg-whitewhite dark:bg-darkBG dark:text-white">
          <Toaster />
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
        </div>
      </div>
    );
  }
  if ((!authed || (statusQuery.isFetched))) {
    return (
      <div className={clsx('h-screen', { dark: darkMode })}>
        <div
          className="App h-screen overflow-y-auto overflow-x-hidden scrollbar bg-whitewhite dark:bg-darkBG dark:text-white"
        >
          <Toaster
            position="top-right"
            toastOptions={
          {
            duration: 3000,
          }
      }
          />
          {(!authed && qc.getQueryData(['user']) === null) ? (
            <Routes>
              <Route path="*" element={<Login />} />
              <Route index element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password/" element={<ForgotPassword />} />
              <Route path="auth/registration/account-confirm-email/:key" element={<VerifyEmail loggedIn={false} />} />
              <Route path="auth/password/reset/confirm/:uid/:token/" element={<PassReset />} />
            </Routes>
          ) : (
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
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={clsx('App', { dark: darkMode })}>
      <div className="App h-screen overflow-y-auto overflow-x-hidden scrollbar bg-black dark:bg-dark dark:text-white">
        <Toaster />
      </div>
    </div>
  );
}

export default App;
