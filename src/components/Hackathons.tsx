import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import { userQuery } from '@/lib/queriesAndLoaders';

export default function Hackathons(): JSX.Element {
  useDocumentTitle('Hackathons');
  let loggedInUser: User = { ...initialUserState };
  const { data: userQueryData, isSuccess: userQuerySuccess } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
  }
  return (
    <div>
      <p className="text-center">{loggedInUser && loggedInUser.first_name}</p>
    </div>
  );
}
