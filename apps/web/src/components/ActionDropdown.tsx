import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';
import { classNames } from '@devclad/lib';

// todo: add a way to pass in a custom icon

interface ActionDropdownProps {
	items: {
		name: string;
		icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
		onClick: () => void;
	}[];
}

export default function ActionDropdown({ items }: ActionDropdownProps): JSX.Element {
	return (
		<div className="flex flex-col">
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button
						className="inline-flex justify-center
            rounded-md border border-neutral-800 bg-black p-2
            font-semibold
            text-white duration-300 hover:border-neutral-400 hover:bg-neutral-900"
					>
						<span className="sr-only">Open options</span>
						<EllipsisVerticalIcon className="h-6 w-6 lg:h-8" aria-hidden="true" />
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items
						className="absolute right-0 z-10 mt-2 w-auto origin-top-right
            rounded-md border-[1px] border-neutral-200 bg-black shadow-lg
            ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-neutral-800"
					>
						<div className="py-1 font-light">
							{items.map((item) => (
								<Menu.Item key={item.name}>
									{({ active }) => (
										<button
											type="button"
											onClick={item.onClick}
											className={classNames(
												active ? 'text-neutral-100' : 'text-neutral-400',
												'block px-4 py-2 text-sm'
											)}
										>
											<span className="flex items-center">
												<span className="mr-2">
													{' '}
													<item.icon
														className="h-6 w-6 flex-shrink-0"
														aria-hidden="true"
													/>
												</span>
												{item.name}
											</span>
										</button>
									)}
								</Menu.Item>
							))}
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
