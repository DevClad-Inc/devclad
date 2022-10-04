import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import { streamQuery, userQuery } from '@/lib/queriesAndLoaders';

export default function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [streamToken, setStreamToken] = React.useState('');
  const userRef = React.useRef<User>({ ...initialUserState });

  const { isSuccess, data } = useQuery(userQuery());
  const { isSuccess: streamSuccess, data: streamData } = useQuery(streamQuery());

  if (isSuccess && data && streamSuccess && streamData) {
    userRef.current = data.data;
    const undefinedUser = Object.values(userRef.current).every((value) => value === undefined);
    if (!undefinedUser && !authed && streamToken === '') {
      setAuthed(true);
      setStreamToken(streamData.data);
    }
  }
  return { authed, loggedInUser: userRef.current, streamToken };
}
