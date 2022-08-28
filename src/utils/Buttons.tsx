import React from 'react';
import { classNames } from '../components/AppShell';

interface ButtonProps {
  children: React.ReactNode;
  isSubmitting?: boolean;
  wFull?: boolean;
}

const primaryString = `border border-transparent bg-orange-700
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

PrimaryButton.defaultProps = {
  isSubmitting: false,
  wFull: false,
};
