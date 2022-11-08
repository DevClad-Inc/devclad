import React, { Fragment } from 'react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { classNames, useDocumentTitle } from '@devclad/lib';
import {
	UserGroupIcon,
	VideoCameraIcon,
	ChatBubbleLeftRightIcon,
	WrenchIcon,
	UserCircleIcon,
	KeyIcon,
	CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { API_URL, DEVELOPMENT, logOut } from '@/services/auth.services';
import { LoadingSpinner } from '@/lib/Buttons.lib';
import { useAuth } from '@/services/useAuth.services';
import { useProfile } from '@/services/socialHooks.services';

const items = [
	{
		id: 1,
		name: 'Messages Dashboard',
		url: '/messages',
		icon: ChatBubbleLeftRightIcon,
	},
	{
		id: 2,
		name: '1-on-1',
		description: "This Week's 1-on-1s",
		url: '/social',
		icon: VideoCameraIcon,
	},
	{
		id: 3,
		name: 'My Circle',
		url: '/social/circle',
		icon: UserGroupIcon,
	},
	{
		id: 4,
		name: 'Meetings',
		description: 'Upcoming Meetings',
		url: '/meetings',
		icon: CalendarDaysIcon,
	},
	{
		id: 5,
		name: 'Account Settings',
		url: '/settings',
		icon: WrenchIcon,
	},
	{
		id: 6,
		name: 'Social Preferences',
		description: 'Tweak ML Preferences',
		url: '/settings/social',
		icon: UserCircleIcon,
	},
	{
		id: 7,
		name: 'Email and Password',
		description: '–and Github OAuth',
		url: '/settings/password',
		icon: KeyIcon,
	},
];

const userNavigation = [{ name: 'Settings', href: 'settings/' }];

export function SignOut(): JSX.Element {
	const [loggingOut, setLoggingOut] = React.useState(false);
	const handlelogOut = async () => {
		setLoggingOut(true);
		await logOut();
	};
	return (
		<button
			onClick={handlelogOut}
			type="button"
			className="bg-darkBG2 hover:bg-darkBG hover:border-mistyRose hover:text-mistyRose flex w-full items-center
			justify-between space-x-6 rounded-md border-[1px]  border-neutral-900 p-6 text-neutral-400
			 shadow-2xl shadow-white/10 focus:ring-red-900"
		>
			<div className="flex-1 truncate">
				<div className="flex items-center space-x-3">
					<h3 className="truncate text-sm font-medium">
						{loggingOut ? 'Signing' : 'Sign'} Out
					</h3>
				</div>
			</div>
			{loggingOut ? (
				<LoadingSpinner />
			) : (
				<ArrowLeftOnRectangleIcon className="h-6 w-6 flex-shrink-0 " aria-hidden="true" />
			)}
		</button>
	);
}

function DashCard({ item }: { item: typeof items[0] }): JSX.Element {
	const { name, description, url, icon: Icon } = item;
	return (
		<Link
			to={url}
			className="bg-darkBG2 hover:bg-darkBG flex w-full items-center
			justify-between space-x-6 rounded-md border-[1px]
			 border-neutral-900 p-6 shadow-2xl shadow-white/10 hover:border-neutral-400"
		>
			<div className="flex-1 truncate">
				<div className="flex items-center space-x-3">
					<h3 className="truncate text-sm font-medium text-neutral-100">{name}</h3>
				</div>
				<p className="mt-1 truncate text-sm text-neutral-500">{description}</p>
			</div>
			<Icon className="h-6 w-6 flex-shrink-0 text-neutral-400" aria-hidden="true" />
		</Link>
	);
}

export function Home(): JSX.Element {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const { authed, loggedInUser } = useAuth();
	const profile = useProfile(loggedInUser.username !== undefined ? loggedInUser.username : '');
	const someURl = `https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/b385cb56555015.59b2ef09aa6e1.jpg`;

	useDocumentTitle('Dashboard');
	React.useEffect(() => {
		if (!authed && qc.getQueryData(['user']) === null) {
			navigate('/');
		}
	}, [authed, qc, navigate]);
	return (
		<div>
			<Disclosure
				as="nav"
				style={{
					backgroundImage: `url(${someURl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<div className="mx-auto max-w-7xl rounded-lg border-[1px] border-neutral-800 bg-black/75 px-4 pt-2 pb-2 sm:bg-transparent sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<div className="block">
								<div className="flex items-baseline space-x-4 sm:ml-10">
									<h1 className="text-left text-2xl font-bold sm:text-3xl">
										<span className="font-mono text-orange-200">
											{loggedInUser?.first_name}&apos;s
										</span>
										{'  '}
										Dashboard
									</h1>
								</div>
							</div>
						</div>
						<div className="block">
							<div className="flex items-center sm:ml-4 md:ml-6">
								<Menu as="div" className="relative ml-3">
									<div className="block sm:hidden">
										<Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800">
											<span className="sr-only">Profile Menu</span>
											{profile && (
												<img
													className="h-10 w-10 rounded-full sm:h-16 sm:w-16"
													src={
														DEVELOPMENT
															? API_URL + profile.avatar
															: profile?.avatar
													}
													alt=""
												/>
											)}
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
										<Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border-[1px] border-neutral-800 bg-black py-1 shadow-2xl shadow-white/30 ring-1 ring-black ring-opacity-5 focus:outline-none">
											<Menu.Item key="profile">
												<Link
													to={`/profile/${loggedInUser.username}`}
													className={classNames(
														'block px-4 py-2 text-sm text-orange-200'
													)}
												>
													{loggedInUser.first_name}&apos;s Profile
												</Link>
											</Menu.Item>
											{userNavigation.map((item) => (
												<Menu.Item key={item.name}>
													<Link
														to={item.href}
														className={classNames(
															'block px-4 py-2 text-sm text-orange-200'
														)}
													>
														{item.name}
													</Link>
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>
				</div>
			</Disclosure>

			<div className="bg-darkBG2 mx-auto py-8 sm:px-6 lg:px-8">
				<div className="mt-12 flex justify-center">
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-3">
						{items.map((item) => (
							<DashCard item={item} />
						))}
						<SignOut />
					</div>
				</div>
			</div>
		</div>
	);
}
