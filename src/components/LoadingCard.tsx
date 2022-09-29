import React from 'react';
import { altString } from '@/lib/Buttons.lib';

export default function LoadingCard(): JSX.Element {
  return (
    <div>
      <div className="justify-center flex p-4">
        <div
          className="bg-gradient-to-r dark:from-orange-900/30 dark:to-darkBG dark:rounded-lg
          from-orange-700/30 to-orange-900 shadow rounded-xl md:w-3/4 sm:w-full animate-pulse"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="justify-evenly mt-5 flex">
              <span className={altString} />
              <span className={altString} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
