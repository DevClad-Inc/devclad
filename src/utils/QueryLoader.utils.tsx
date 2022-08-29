import React from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { LoadingButton } from './Buttons.utils';

export default function QueryLoader() {
  const isFetching = useIsFetching();
  if (isFetching) {
    return (
      <LoadingButton />
    );
  }
  return null;
}
