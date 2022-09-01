import React from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { LoadingButton } from './Buttons.utils';
import { useSlowContext } from '../context/Speed.context';

export default function QueryLoader() {
  const isFetching = useIsFetching();
  const { slowMode, toggle } = useSlowContext();
  const [time, setTime] = React.useState(0);
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    let interval:any = null;
    if (isFetching) {
      setActive(true);
      setTime((t) => t + 1);
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      setActive(false);
      setTime(0);
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isFetching]);
  if ((time > 4 && active)) {
    toggle(true);
  }
  if ((slowMode && active)) {
    // works considering users are not constantly switching
    // back and forth between slow and fast connections
    // jic: I've added sessionstorage to persist the slowMode state if we want to later
    toast.custom(
      <LoadingButton />,
      {
        id: 'slow-connection',
        position: 'top-center',
      },
    );
  }
  return null;
}
