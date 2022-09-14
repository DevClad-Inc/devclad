import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  User, initialUserState,
} from '@/lib/InterfacesStates.lib';
import { getUser } from '@/services/auth.services';

export default function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  let loggedInUser: User = { ...initialUserState };
  const userQuery = useQuery(['user'], () => getUser());
  // ASSIGNING
  if (userQuery.isSuccess && userQuery.data) {
    const { data } = userQuery;
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
