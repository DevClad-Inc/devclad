import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GraphTexure from '@devclad/ui/assets/svg/graph-texture.svg';
import Landing from '@/components/Landing';

function App() {
  return (
    <div style={{ backgroundImage: `url(${GraphTexure})` }}>
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
