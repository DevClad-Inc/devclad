import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import { streamQuery, userQuery } from '@/lib/queriesAndLoaders';

export default function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const streamTokenRef = React.useRef<string | null>(null);
  const userRef = React.useRef<User>({ ...initialUserState });

  // loginform's on submit handles token used in theses queries
  const { isSuccess, data } = useQuery(userQuery());
  const { isSuccess: streamSuccess, data: streamData } = useQuery(streamQuery());

  if (isSuccess && data && streamSuccess && streamData) {
    userRef.current = data.data;
    streamTokenRef.current = streamData;
    const undefinedUser = Object.values(userRef.current).every((value) => value === undefined);
    if (!undefinedUser && !authed && streamTokenRef.current) {
      setAuthed(true);
    }
  }
  return { authed, loggedInUser: userRef.current, streamToken: streamTokenRef.current };
}
