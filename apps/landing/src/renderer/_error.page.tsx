import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function Page({ is404 }: { is404: boolean }) {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </>
    );
  }
  return (
    <>
      <h1>500 Internal Server Error</h1>
      <p>Something went wrong.</p>
    </>
  );
}
