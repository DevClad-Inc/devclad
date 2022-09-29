import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { userCircleQuery } from '@/lib/queriesAndLoaders';

const useConnected = (username: string, otherUser: string): boolean => {
  const [connected, setConnected] = React.useState(false);
  const circleQuery = useQuery(userCircleQuery(username));
  const otherUsercircleQuery = useQuery(userCircleQuery(otherUser));

  if (
    circleQuery.isSuccess &&
    otherUsercircleQuery.isSuccess &&
    circleQuery.data &&
    otherUsercircleQuery.data
  ) {
    const { data } = circleQuery.data;
    const { data: otherUserData } = otherUsercircleQuery.data;
    const { circle } = data;
    const otherUserCircle = otherUserData.circle;
    if (circle !== undefined && otherUserCircle !== undefined) {
      if (circle.includes(otherUser) && otherUserCircle.includes(username) && !connected) {
        setConnected(true);
      }
    }
  }
  return connected;
};

export default useConnected;
