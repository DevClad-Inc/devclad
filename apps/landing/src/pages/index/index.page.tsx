import React from 'react';
import GraphTexture from '@devclad/ui/assets/graph-texture.svg';
import Landing from '@/components/Landing';

// eslint-disable-next-line import/prefer-default-export
export function Page() {
  return (
    <div style={{ backgroundImage: `url(${GraphTexture})` }}>
      <div className="App bg-gradient-to-t from-darkBG/30 via-black to-blackChocolate/50 text-white">
        <Landing />
      </div>
    </div>
  );
}
