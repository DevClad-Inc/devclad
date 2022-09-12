import React from 'react';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';

export default function Projects() : JSX.Element {
  useDocumentTitle('Projects');
  return (
    <div>
      <p className="text-center">Projects</p>
    </div>
  );
}
