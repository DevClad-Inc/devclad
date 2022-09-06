import React, { useContext, useEffect } from 'react';
import {
  Routes, Route,
} from 'react-router-dom';
import { clsx } from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeContext } from './context/Theme.context';
import { User, initialUserState } from './utils/InterfacesStates.utils';
import { getUser, refreshToken } from './services/auth.services';
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
import PassReset from './components/PasswordReset';

function App() {
  const { darkMode } = useContext(ThemeContext);
  let loggedInUser: User = { ...initialUserState };
  const userQuery = useQuery(['user'], () => getUser());
  if (userQuery.isSuccess && userQuery.data !== null) {
    const { data } = userQuery;
    loggedInUser = data.data;
  }
  const undefinedUser = Object.values(loggedInUser).every(
    (value) => value === undefined,
  );
  useEffect(() => {
    // if (window.location.pathname === '/signup' || window.location.pathname === '/signup/') {
    //   window.history.replaceState({}, '', '/#/signup');
    //   navigate(0);
    // }
    if (!undefinedUser) {
      setInterval(refreshToken, (1800 * 1000));
    }
  }, [loggedInUser]);
  // todo: add splash screen
  return (
    <div className={clsx('h-screen', { dark: darkMode })}>
      <div
        className="App h-screen overflow-y-auto overflow-x-hidden scrollbar bg-white dark:bg-darkBG dark:text-white"
      >
        <Toaster
          position="top-right"
          toastOptions={
          {
            duration: 3000,
          }
      }
        />
        {(undefinedUser && (!userQuery.isLoading || !userQuery.isFetching)) ? (
          <Routes>
            <Route path="*" element={<Login />} />
            <Route index element={<Login />} />
            <Route path="signup" element={<Signup />} />
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

export default App;
