import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { refreshToken } from './services/AuthService';
import { useUserContext } from './services/userContext';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const loggedInUser = useUserContext();
  const undefinedUser = Object.values(loggedInUser).every(
    (value) => value === undefined,
  );

  useEffect(() => {
    if (!undefinedUser) {
      // console.log('logged in');
      setInterval(refreshToken, 1000 * 60 * 60 * 12);
    }
  }, [loggedInUser]);
  return (
    <div className="App">
      {!undefinedUser ? (
        <Routes>
          <Route path="*" element={<div>Not Found</div>} />
          <Route path="/" element={<Home />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
