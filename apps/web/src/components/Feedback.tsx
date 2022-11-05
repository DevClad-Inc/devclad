import React from 'react';
import {
	InformationCircleIcon,
	CheckIcon,
	XMarkIcon,
	ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

export function Success({ success }: { success: string }): JSX.Element {
	return (
		<div className="border-phthaloGreen shadow-phthaloGreen/30 mb-4 rounded-md border-[1px] bg-green-50 p-4 shadow-2xl dark:bg-black">
			<div className="flex">
				<div className="flex-shrink-0">
					<CheckIcon
						className="h-6 w-5 text-green-400 dark:text-green-200"
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
		<div className="bg-gyCrayola dark:bg-blackChocolate mb-4 rounded-md p-4">
			<div className="flex">
				<div className="flex-shrink-0">
					<ShieldExclamationIcon
						className="text-bistreBrown dark:text-saffron h-6 w-5"
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3">
					<h3 className="text-bistreBrown  dark:text-saffron text-sm">{warning}</h3>
				</div>
			</div>
		</div>
	);
}

export function Info({ info }: { info: string }): JSX.Element {
	return (
		<div className="bg-beauBlue dark:bg-oxfordBlue mb-4 rounded-md p-4">
			<div className="flex">
				<div className="flex-shrink-0">
					<InformationCircleIcon
						className="text-oxfordBlue dark:text-beauBlue h-6 w-5"
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3">
					<h3 className="text-oxfordBlue  dark:text-beauBlue text-sm">{info}</h3>
				</div>
			</div>
		</div>
	);
}

export function Error({ error }: { error: string }): JSX.Element {
	return (
		<div className="border-bloodRed2 shadow-bloodRed2/30 bg-mistyRose mb-4 rounded-md border-[1px] p-4 shadow-2xl dark:bg-black">
			<div className="flex">
				<div className="flex-shrink-0">
					<XMarkIcon
						className="text-bloodRed dark:text-mistyRose h-6 w-5"
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3">
					<h3 className="text-bloodRed  dark:text-mistyRose text-sm">{error}</h3>
				</div>
			</div>
		</div>
	);
}
