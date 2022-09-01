import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export function Success({ success }: { success: string }): JSX.Element {
  return (
    <div className="rounded-md bg-green-50 dark:bg-phthaloGreen p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-200" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{success}</h3>
        </div>
      </div>
    </div>
  );
}

export function Error({ error }: { error: string }): JSX.Element {
  return (
    <div className="rounded-md bg-mistyRose dark:bg-bloodRed p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-bloodRed dark:text-mistyRose">{error}</h3>
        </div>
      </div>
    </div>
  );
}
