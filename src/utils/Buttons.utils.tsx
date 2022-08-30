import React from 'react';
import classNames from './ClassNames.utils';

interface ButtonProps {
  children: React.ReactNode;
  isSubmitting?: boolean;
  wFull?: boolean;
}

const primaryString = `border border-transparent bg-orange-700 text-white
        dark:bg-raisinBlack2 duration-500 rounded-md py-2 px-4
        inline-flex justify-center text-sm font-bold dark:text-fuchsia-300`;

// meant for Formik forms
export function PrimaryButton({
  children, isSubmitting, wFull,
}: ButtonProps) {
  return (
    <button
      type="submit"
      // check if onclick is defined, if not, use handleClick
      disabled={isSubmitting}
      className={classNames(
        wFull ? 'w-full' : 'w-auto',
        primaryString,
      )}
    >
      {children}
    </button>
  );
}

export function AlertButton({ children, isSubmitting }:
{ children: React.ReactNode; isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="border border-transparent bg-orange-700 dark:bg-raisinBlack2 duration-500
      rounded-md py-2 px-4 inline-flex justify-center text-sm font-bold dark:text-fuchsia-300"
    >
      {children}
    </button>
  );
}

export function LoadingButton({ children }: { children?: React.ReactNode }) {
  const waitTexts = [
    'Loading',
    'Just a sec',
    'Meow',
    'Pi Pi Pi',
    'Stare at this',
  ];
  return (
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 leading-6 text-sm shadow rounded-md
      border border-transparent bg-orange-700 dark:bg-raisinBlack2
      justify-center font-black dark:text-fuchsia-300 transition infinite cursor-not-allowed"
      disabled
    >
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {waitTexts[Math.floor(Math.random() * waitTexts.length)]}
      {children}
    </button>
  );
}
PrimaryButton.defaultProps = {
  isSubmitting: false,
  wFull: false,
};

LoadingButton.defaultProps = {
  children: null,
};