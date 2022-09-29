import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import { userQuery } from '@/lib/queriesAndLoaders';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import Tab from '@/components/Tab';

const tabs = [
  { name: '1-on-1', href: '/social' },
  { name: 'Circle', href: '/social/circle' },
];

export default function Social(): JSX.Element {
  useDocumentTitle('Social Mode');
  let loggedInUser: User = { ...initialUserState };
  const { data: userQueryData, isSuccess: userQuerySuccess } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
  }
  return (
    <>
      <Tab tabs={tabs} />
      <span className="hidden"> {loggedInUser.username} </span>

      <Outlet />
    </>
  );
}
