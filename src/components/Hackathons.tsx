import React from 'react';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function Hackathons() : JSX.Element {
  useDocumentTitle('Hackathons');
  return (
    <div>
      <p className="text-center">Hackathons</p>
    </div>
  );
}
