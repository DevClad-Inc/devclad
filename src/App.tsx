import React, { useContext, useEffect } from 'react';
import {
  Routes, Route, useNavigate,
} from 'react-router-dom';
import { clsx } from 'clsx';
import { useUserContext } from './context/User.context';
import { ThemeContext } from './context/Theme.context';
import { refreshToken } from './services/AuthService';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Settings from './components/Settings';
import NewSettings from './components/NewSettings';
import AppShell from './components/AppShell';

function App() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const loggedInUser = useUserContext();
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
  return (
    <div className={clsx('h-screen', { dark: darkMode })}>
      <div
        className="App h-screen dark:bg-darkBG dark:text-white"
      >
        {!undefinedUser ? (
          <AppShell>
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/newset" element={<NewSettings />} />
            </Routes>
          </AppShell>
        ) : (
          <Routes>
            <Route path="*" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
