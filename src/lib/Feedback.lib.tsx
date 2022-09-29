import {
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/solid';
import React from 'react';

export function Success({ success }: { success: string }): JSX.Element {
  return (
    <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-phthaloGreen">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400 dark:text-green-200"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm  text-green-800 dark:text-green-200">{success}</h3>
        </div>
      </div>
    </div>
  );
}

export function Warning({ warning }: { warning: string }): JSX.Element {
  return (
    <div className="mb-4 rounded-md bg-gyCrayola p-4 dark:bg-blackChocolate">
      <div className="flex">
        <div className="flex-shrink-0">
          <ShieldExclamationIcon
            className="h-5 w-5 text-bistreBrown dark:text-saffron"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm  text-bistreBrown dark:text-saffron">{warning}</h3>
        </div>
      </div>
    </div>
  );
}

export function Info({ info }: { info: string }): JSX.Element {
  return (
    <div className="mb-4 rounded-md bg-beauBlue p-4 dark:bg-oxfordBlue">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-6 w-6 text-oxfordBlue dark:text-beauBlue"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm  text-oxfordBlue dark:text-beauBlue">{info}</h3>
        </div>
      </div>
    </div>
  );
}

export function Error({ error }: { error: string }): JSX.Element {
  return (
    <div className="mb-4 rounded-md bg-mistyRose p-4 dark:bg-bloodRed/60">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm  text-bloodRed dark:text-mistyRose">{error}</h3>
        </div>
      </div>
    </div>
  );
}
