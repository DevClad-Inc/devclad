import React from 'react';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function Social() : JSX.Element {
  useDocumentTitle('Social');
  return (
    <div>
      <p className="text-center">Social</p>
    </div>
  );
}
