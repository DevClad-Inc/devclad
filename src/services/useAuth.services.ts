import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import { statusQuery, streamQuery, userQuery } from '@/lib/queriesAndLoaders';
import getsetIndexedDB from '@/lib/getsetIndexedDB.lib';

export function useAuth() {
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

    if (undefinedUser) {
      getsetIndexedDB('user', 'get')
        .then((user) => {
          if (user) {
            userRef.current = user as User;
            setAuthed(true);
          }
        })
        .catch(() => {
          setAuthed(false);
        });
    }
    if (!authed && streamTokenRef.current) {
      setAuthed(true);
    }
  }
  return { authed, loggedInUser: userRef.current, streamToken: streamTokenRef.current };
}

export function useApproved() {
  const { loggedInUser } = useAuth();
  const [approved, setApproved] = React.useState<boolean | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  const sQuery = useQuery({
    ...statusQuery(),
    enabled: loggedInUser.pk !== undefined,
  });

  if (
    sQuery.isSuccess &&
    sQuery.data &&
    approved !== sQuery.data.data.approved &&
    status !== sQuery.data.data.status
  ) {
    setApproved(sQuery.data.data.approved);
    setStatus(sQuery.data.data.status);
  }
  return { approved, status };
}
