import React from 'react';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function Projects() : JSX.Element {
  useDocumentTitle('Projects');
  return (
    <div>
      <p className="text-center">Projects</p>
    </div>
  );
}
