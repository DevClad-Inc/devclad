import React from 'react';
import { useIsFetching } from '@tanstack/react-query';
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
  if ((time > 3 && active) || (slowMode && active)) {
    // not a perfect mechanism; but works considering users are not
    // constantly switching back and forth between slow and fast connections
    toggle(true);
    console.log('Slow Internet Connection detected');
    return (
      <LoadingButton />
    );
  }
  return null;
}
