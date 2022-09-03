import React from 'react';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function FourOFour() : JSX.Element {
  useDocumentTitle('Oops! 404');
  return (
    <div>
      <h1>404</h1>
    </div>
  );
}
