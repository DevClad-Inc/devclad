import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  User, initialUserState,
} from '@/lib/InterfacesStates.lib';
import { userQuery } from '@/lib/queriesAndLoaders';

export default function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  let loggedInUser: User = { ...initialUserState };

  const { isSuccess, data } = useQuery(userQuery());

  if (isSuccess && data) {
    loggedInUser = data.data;
    const undefinedUser = Object.values(loggedInUser).every(
      (value) => value === undefined,
    );
    if (!undefinedUser && !authed) {
      setAuthed(true);
    }
  }
  return { authed, loggedInUser };
}
