import React from 'react';
import { classNames } from '@devclad/lib';

interface ButtonProps {
	children: React.ReactNode;
	isSubmitting?: boolean;
	disabled?: boolean;
	wFull?: boolean;
	className?: string;
}

export const altString = `border border-transparent bg-orange-300
duration-500 rounded-md py-2 px-4 inline-flex justify-center font-semibold text-black`;

export const warningString = `mt-5 inline-flex items-center px-4 py-2
border border-transparent text-sm font-semibold
rounded-md shadow-sm text-bistreBrown bg-gyCrayola
dark:text-saffron dark:bg-blackChocolate`;

export const redString = `mt-5 inline-flex items-center px-4 py-2
border border-transparent text-sm font-semibold
rounded-md shadow-sm text-mistyRose bg-bloodRed2`;

export const greenString = `mt-5 inline-flex items-center px-4 py-2
border border-transparent text-sm font-semibold
rounded-md shadow-sm text-phthaloGreen bg-honeyDew
dark:bg-phthaloGreen dark:text-honeyDew`;

// meant for Formik forms
export function PrimaryButton({ children, isSubmitting, disabled, wFull, className }: ButtonProps) {
	return (
		<button
			type="submit"
			disabled={isSubmitting || disabled}
			className={classNames(
				wFull ? 'w-full' : 'w-auto px-6',
				className ||
					`inline-flex justify-center
      rounded-md border border-neutral-800 bg-black py-2 px-4
      font-semibold
      text-white duration-300 hover:border-neutral-400 hover:bg-neutral-900`
			)}
		>
			{children}
		</button>
	);
}

export function AlertButton({
	children,
	isSubmitting,
}: {
	children: React.ReactNode;
	isSubmitting: boolean;
}) {
	return (
		<button
			type="submit"
			disabled={isSubmitting}
			className="dark:bg-raisinBlack2 inline-flex justify-center rounded-md border
      border-transparent bg-orange-700 py-2 px-4 text-sm font-bold duration-500 dark:text-orange-300"
		>
			{children}
		</button>
	);
}

export const badge = (interests: string, classes: string) => {
	const interestsArray = interests.split(',');
	return interestsArray.map((interest) => (
		<span
			className={classNames('inline-flex items-center rounded-md px-3 py-0.5', classes)}
			key={interest}
		>
			{interest}
		</span>
	));
};
PrimaryButton.defaultProps = {
	isSubmitting: false,
	disabled: false,
	wFull: false,
	className: `border border-neutral-800
  bg-black duration-300 rounded-md py-2 px-4 hover:bg-neutral-900
  hover:border-neutral-400
  inline-flex justify-center font-semibold text-white`,
};
