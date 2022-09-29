import React, { useState, useContext, createContext, useMemo } from 'react';

export const SlowContext = createContext({
  slowMode: false,
} as {
  slowMode: boolean;
  toggle: (slowMode: boolean) => void;
});

export function SpeedProvider({ children }: { children: React.ReactNode }) {
  const [slowMode, setSlowMode] = useState(false);
  const toggle = (slow: boolean) => {
    setSlowMode(slow);
    sessionStorage.setItem('slowMode', slow.toString());
  };
  return (
    <SlowContext.Provider value={useMemo(() => ({ slowMode, toggle }), [slowMode])}>
      {children}
    </SlowContext.Provider>
  );
}

export function useSlowContext() {
  return useContext(SlowContext);
}
