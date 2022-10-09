import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDocumentTitle } from '@devclad/lib';
import Tab from '@/components/Tab';
import { useAuth } from '@/services/useAuth.services';

const tabs = [
  { name: '1-on-1', href: '/social' },
  { name: 'Circle', href: '/social/circle' },
];

export default function Social(): JSX.Element {
  useDocumentTitle('Social Mode');
  const { loggedInUser } = useAuth();
  return (
    <>
      <Tab tabs={tabs} />
      <span className="hidden"> {loggedInUser.username} </span>
      <Outlet />
    </>
  );
}
