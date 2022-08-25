import React, { useContext, useEffect } from 'react';
import {
  Routes, Route, useNavigate,
} from 'react-router-dom';
import { clsx } from 'clsx';
import { useUserContext } from './context/User.context';
import { refreshToken } from './services/AuthService';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Settings from './components/Settings';
import TestHome from './components/TestHome';
import { ThemeContext } from './context/Theme.context';

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
      // console.log('logged in');
      setInterval(refreshToken, 1000 * 60 * 60 * 12);
    }
  }, [loggedInUser]);
  return (
    <div className={clsx('h-screen', { dark: darkMode })}>
      <div className="App h-screen dark:bg-black">
        {!undefinedUser ? (
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/beta" element={<TestHome />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
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
