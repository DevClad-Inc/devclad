import React from 'react';
import GraphTexture from '@devclad/ui/assets/graph-texture.svg';
import Landing from '@/components/Landing';

// eslint-disable-next-line import/prefer-default-export
export function Page() {
  return (
    <div
      className="relative bg-black"
      style={{
        backgroundImage: `url(${GraphTexture})`,
      }}
    >
      <div className="relative bg-gradient-to-br from-black/90 via-black/90 to-darkBG2/90">
        <div className="animation-delay-2000 absolute top-10 -left-2 h-72 w-72 animate-blob rounded-full bg-sky-900/30 opacity-50 mix-blend-difference blur-2xl filter" />
        <div className="absolute top-20 left-20 h-72 w-72 animate-blob rounded-full bg-gradient-to-tr from-sky-900/30 via-fuchsia-900/30 to-black opacity-50 mix-blend-difference blur-2xl filter" />
        <div className="relative z-50">
          <Landing />
        </div>
        <div className="absolute bottom-5 right-2 h-96 w-96 animate-blob rounded-full bg-orange-900/10 opacity-80 mix-blend-difference blur-2xl filter" />
        <div className="absolute bottom-5 left-2 h-96 w-96 animate-blob rounded-full bg-orange-900/10 opacity-80 mix-blend-difference blur-2xl filter" />
        <div className="absolute bottom-1/2 right-2 h-96 w-96 animate-blob rounded-full bg-sky-900/30 opacity-50 mix-blend-difference blur-2xl filter" />
        <div className="animate-dropdarkglow absolute bottom-1/2 right-2 h-96 w-96 animate-blob rounded-full bg-gradient-to-tr from-sky-900/30 via-fuchsia-900/30 to-black opacity-50 mix-blend-difference blur-2xl filter" />
      </div>
    </div>
  );
}
