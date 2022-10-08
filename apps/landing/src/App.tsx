import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';

function App() {
  return (
    <div className="h-full bg-[url('./assets/graph-paper.svg')]">
      <div className="App bg-gradient-to-t from-darkBG/30 via-black to-blackChocolate/50 text-white">
        <Routes>
          <Route path="*" element={<Landing />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
