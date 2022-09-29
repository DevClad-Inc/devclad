import React from 'react';
import { altString } from '@/lib/Buttons.lib';

export default function LoadingCard(): JSX.Element {
  return (
    <div>
      <div className="flex justify-center p-4">
        <div
          className="animate-pulse rounded-xl bg-gradient-to-r from-orange-700/30
          to-orange-900 shadow dark:rounded-lg dark:from-orange-900/30 dark:to-darkBG sm:w-full md:w-3/4"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="mt-5 flex justify-evenly">
              <span className={altString} />
              <span className={altString} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
