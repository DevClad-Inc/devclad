import React from 'react';
import { altString } from '@/lib/Buttons.lib';

// Profile Loading is for Profile Cards
export function ProfileLoading(): JSX.Element {
	return (
		<div>
			<div className="flex justify-center p-4">
				<div
					className="dark:to-darkBG animate-pulse rounded-xl bg-gradient-to-r
          from-orange-700/30 to-orange-900 shadow dark:rounded-lg dark:from-orange-900/30 sm:w-full md:w-3/4"
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

export function MessagesLoading(): JSX.Element {
	return (
		<div className="space-y-6 sm:px-6 lg:col-span-8 lg:px-0">
			<div className="shadow sm:overflow-hidden sm:rounded-md">
				<div
					className="bg-darkBG2 via-darkBG2 h-full animate-pulse space-y-6 rounded-md
        border-2 border-neutral-800 bg-gradient-to-r from-orange-300 to-black py-6 px-4
        shadow sm:p-6"
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
