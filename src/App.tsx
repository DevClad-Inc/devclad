import React, { useContext, useEffect } from 'react';
import {
  Routes, Route, useNavigate,
} from 'react-router-dom';
import { clsx } from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { initialUserState, User } from './context/User.context';
import { ThemeContext } from './context/Theme.context';
import { getUser, refreshToken } from './services/AuthService';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Settings from './components/Settings';
import AppShell from './components/AppShell';
import QueryLoader from './utils/QueryLoader.utils';

function App() {
  const navigate = useNavigate();
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
    if (window.location.pathname === '/signup' || window.location.pathname === '/signup/') {
      window.history.replaceState({}, '', '/#/signup');
      navigate(0);
    }
    if (!undefinedUser) {
      setInterval(refreshToken, (1800 * 1000));
    }
  }, [loggedInUser]);
  // todo: add splash screen
  return (
    <div className={clsx('h-screen', { dark: darkMode })}>
      <div
        className="App h-screen dark:bg-darkBG dark:text-white"
      >
        {(undefinedUser && !userQuery.isLoading) ? (
          <Routes>
            <Route path="*" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Routes>
        ) : (
          <AppShell>
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AppShell>
        )}
      </div>
      <QueryLoader />
    </div>
  );
}

export default App;
