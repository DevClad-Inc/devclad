import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import { statusQuery, streamQuery, userQuery } from '@/lib/queriesAndLoaders';

export type StreamTokenT = {
  token: string;
  uid: string;
};

export function useAuth() {
  const authedRef = React.useRef<boolean>(false);
  const streamTokenRef = React.useRef<StreamTokenT | null>(null);
  const userRef = React.useRef<User>({ ...initialUserState });

  const { isSuccess, data } = useQuery(userQuery());
  const { isSuccess: streamSuccess, data: streamData } = useQuery(streamQuery());

  if (streamSuccess && streamData) {
    streamTokenRef.current = streamData;
  }

  if (isSuccess && data) {
    userRef.current = data.data;
    authedRef.current = true;
  }

  const undefinedUser = Object.values(userRef.current).every((value) => value === undefined);

  if (undefinedUser) {
    authedRef.current = false;
  }
  return {
    authed: authedRef.current,
    loggedInUser: userRef.current,
    streamToken: streamTokenRef.current,
  };
}

export function useApproved(): { approved: boolean; status: string } {
  const approved = React.useRef<boolean>(false);
  const status = React.useRef<string>('Not Submitted');

  const { isSuccess, data } = useQuery({
    ...statusQuery(),
  });

  if (isSuccess && data && approved !== data.data.approved && status !== data.data.status) {
    approved.current = data.data.approved;
    status.current = data.data.status;
  }
  return { approved: approved.current, status: status.current };
}
