import React from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@/lib/Buttons.lib';
import { useSlowContext } from '@/context/Speed.context';

export default function QueryLoader() {
  const isFetching = useIsFetching();
  const { slowMode, toggle } = useSlowContext();
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    // sloppy way for TypeSafety; couldn't think of a better way yet
    let interval:ReturnType<typeof setInterval> = (
      null) as unknown as ReturnType<typeof setInterval>;
    if (isFetching) {
      setTime((t) => t + 1);
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      setTime(0);
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isFetching]);
  if ((time > 10 && isFetching)) {
    toggle(true);
  }
  if (!isFetching) {
    toggle(false);
  }
  if ((slowMode && isFetching)) {
    // works considering users are not constantly switching
    // back and forth between slow and fast connections
    // jic: I've added sessionstorage to persist the slowMode state if we want to later
    toast.custom(
      <LoadingButton />,
      {
        duration: 3000,
        id: 'slow-connection',
      },
    );
  }
  return null;
}
