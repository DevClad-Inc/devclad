import React from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { LoadingButton } from './Buttons.utils';
import { useSlowContext } from '../context/Speed.context';

export default function QueryLoader() {
  const isFetching = useIsFetching();
  const { slowMode, toggle } = useSlowContext();
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    let interval:ReturnType<typeof setTimeout> = (null as unknown) as ReturnType<typeof setTimeout>;
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
  if ((time > 5 && isFetching)) {
    toggle(true);
  }
  if ((slowMode && isFetching)) {
    // works considering users are not constantly switching
    // back and forth between slow and fast connections
    // jic: I've added sessionstorage to persist the slowMode state if we want to later
    toast.custom(
      <LoadingButton />,
      {
        id: 'slow-connection',
      },
    );
  }
  return null;
}
