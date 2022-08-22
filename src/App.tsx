import React, { useEffect } from 'react';
import {
  Routes, Route, useNavigate,
} from 'react-router-dom';
import { refreshToken } from './services/AuthService';
import { useUserContext } from './services/userContext';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Settings from './components/Settings';

function App() {
  const navigate = useNavigate();
  const loggedInUser = useUserContext();
  const undefinedUser = Object.values(loggedInUser).every(
    (value) => value === undefined,
  );
  useEffect(() => {
    if (window.location.pathname === '/signup' || window.location.pathname === '/signup/') {
      // remove /signup from the pathname if it's there
      // window.history.pushState({}, '', '/');
      window.history.replaceState({}, '', '/#/signup');
      navigate(0);
    }
    if (!undefinedUser) {
      // console.log('logged in');
      setInterval(refreshToken, 1000 * 60 * 60 * 12);
    }
  }, [loggedInUser]);
  return (
    <div className="App">
      {!undefinedUser ? (
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/" element={<Home />} />
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
  );
}

export default App;
