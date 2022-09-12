import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/services/auth.services';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';

export default function Hackathons() : JSX.Element {
  useDocumentTitle('Hackathons');
  let loggedInUser: User = { ...initialUserState };
  const userQuery = useQuery(['user'], () => getUser());
  if (userQuery.isSuccess && userQuery.data !== null) {
    const { data } = userQuery;
    loggedInUser = data.data;
  }
  return (
    <div>
      <p className="text-center">{loggedInUser && loggedInUser.first_name}</p>

    </div>
  );
}
