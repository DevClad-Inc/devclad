import React, { Fragment } from 'react';
import {
	InformationCircleIcon,
	CheckIcon,
	XMarkIcon,
	ShieldExclamationIcon,
	ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Transition, Dialog } from '@headlessui/react';
import { classNames } from '@devclad/lib';

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

export function ConfirmDialog({
	open,
	setOpen,
	cancelButtonRef,
	firstName,
	action,
	onConfirm,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	cancelButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
	firstName: string;
	action: string;
	onConfirm: () => void;
}) {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={cancelButtonRef}
				onClose={setOpen}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-in duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="bg-darkBG2 fixed inset-0 bg-opacity-90 backdrop-blur-sm transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel
								className="
                relative transform
                overflow-hidden rounded-lg
                border-[1px]
                border-neutral-600 bg-black px-4
                pt-5 pb-4 text-left shadow-sm shadow-white/20
                backdrop-blur-sm transition-all sm:my-8
                sm:w-full sm:max-w-lg sm:p-6
                "
							>
								<div className="sm:flex sm:items-start">
									<div
										className={classNames(
											action === 'warn'
												? 'bg-blackChocolate'
												: 'bg-bloodRed2',
											'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10'
										)}
									>
										{action === 'warn' ? (
											<ExclamationTriangleIcon
												className="text-saffron h-6 w-6"
												aria-hidden="true"
											/>
										) : (
											<XMarkIcon
												className="text-mistyRose h-6 w-6"
												aria-hidden="true"
											/>
										)}
									</div>
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<Dialog.Title
											as="h3"
											className="text-lg font-medium capitalize leading-6 text-white"
										>
											{action === 'warn' ? 'Skip' : 'Shadow'} {firstName}?{' '}
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-neutral-100">
												{action === 'warn' &&
													`${firstName} will not be in your weekly 1 on 1 for the next 4 weeks.`}
												{action === 'danger' &&
													`${firstName} will never be in your weekly 1 on 1 again.`}
											</p>
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
									<button
										type="button"
										className={classNames(
											action === 'warn'
												? 'bg-blackChocolate text-saffron hover:bg-saffron hover:text-blackChocolate focus:ring-yellow-900'
												: 'bg-bloodRed2 text-mistyRose hover:bg-red-700 focus:ring-red-900',
											`inline-flex w-full justify-center rounded-md border
                        border-transparent px-6 py-1 text-base
                        font-medium capitalize shadow-sm
                       focus:outline-none focus:ring-2
                       focus:ring-offset-2 sm:w-auto sm:text-sm`
										)}
										onClick={() => {
											onConfirm();
											setOpen(false);
										}}
									>
										{action === 'warn' ? 'Skip' : 'Never show again'}
									</button>
									<button
										type="button"
										className="hover:bg-raisinBlack2 mt-3 inline-flex w-full justify-center rounded-md
                  border border-neutral-600 bg-black px-6 py-1 text-base
                  font-medium text-white shadow-sm focus:outline-none
                    focus:ring-1 focus:ring-orange-300 focus:ring-offset-2
                    sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
										onClick={() => setOpen(false)}
										ref={cancelButtonRef}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
