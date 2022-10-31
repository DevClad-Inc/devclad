import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
	HomeIcon,
	UsersIcon,
	ArrowLeftIcon,
	ChatBubbleLeftRightIcon,
	CalendarDaysIcon,
} from '@heroicons/react/24/outline';

import { checkIOS, checkMacOS, classNames } from '@devclad/lib';
import { DevCladSVG } from '@devclad/ui';
import CheckChild from '@/lib/CheckChild.lib';
import { useAuth } from '@/services/useAuth.services';
import { useProfile } from '@/services/socialHooks.services';
import { Profile } from '@/lib/InterfacesStates.lib';
import { API_URL, DEVELOPMENT } from '@/services/auth.services';

const navigation = [
	{
		name: 'Dashboard',
		href: '/',
		icon: HomeIcon,
		alt: 'Home',
	},
	{
		name: 'Social',
		href: '/social',
		icon: UsersIcon,
		alt: 'Social',
	},
	{
		name: 'Messages',
		href: '/messages',
		icon: ChatBubbleLeftRightIcon,
		alt: 'Messages',
	},
	{
		name: 'Meetings',
		href: '/meetings',
		icon: CalendarDaysIcon,
		alt: 'Meetings',
	},
];

const noBreadCrumbRoutes = ['profile', ''];

export default function AppShell({ children }: { children: React.ReactNode }) {
	const { pathname } = useLocation();
	const pathArray = pathname.split('/');
	pathArray.shift();
	const pageTitle = document.title.slice(10);

	// user logic
	const { loggedInUser } = useAuth();
	const profileData = useProfile(
		loggedInUser.username !== undefined ? loggedInUser.username : ''
	) as Profile;

	// sidebar logic
	const [sidebarExpand, setSidebarExpand] = React.useState(false);

	return (
		<div className="flex h-full">
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-min md:flex-col">
				<div
					className="dark:bg-darkBG2 flex min-h-0 flex-1 flex-col border-l-0
         border-r-2 border-white/5 bg-orange-50 "
				>
					<div className="flex flex-1 flex-col overflow-y-hidden pt-5">
						<div className="flex flex-shrink-0 items-center px-2">
							<button
								type="button"
								onClick={() => setSidebarExpand(!sidebarExpand)}
								className="m-auto"
							>
								<img
									className="m-auto h-24 w-auto rounded-full"
									src={DevCladSVG}
									alt="DevClad"
								/>
							</button>
						</div>
						<nav
							className={classNames(
								sidebarExpand ? 'space-y-4' : 'space-y-24',
								'scrollbar mt-10 flex-1 overflow-auto px-2'
							)}
						>
							{navigation.map((item) => (
								<NavLink
									key={item.name}
									to={item.href}
									className={({ isActive }) =>
										classNames(
											isActive || CheckChild(pathname, item.href)
												? 'text-orange-900 dark:text-white'
												: 'dark:text-neutral-700 dark:hover:text-neutral-100',
											sidebarExpand ? 'rounded-none' : 'rounded-lg',
											'flex items-center px-5 py-3 duration-300'
										)
									}
									end
								>
									<item.icon
										className={classNames(
											sidebarExpand ? 'mr-3 h-8 w-8' : 'm-auto h-8 w-8',
											'flex-shrink-1 stroke-2'
										)}
										aria-hidden="true"
									/>
									<span className="text-md font-mono font-bold">
										{sidebarExpand && item.name}
									</span>
								</NavLink>
							))}
						</nav>
					</div>
					<div className="flex flex-shrink-0 rounded-tl-3xl border-t border-orange-300 p-4 dark:bg-black">
						<Link to="/settings" className="group block w-full flex-shrink-0">
							<div className="flex items-center">
								<div>
									{profileData && (
										<img
											className="bg-linen inline-block h-12 w-12 rounded-full object-cover"
											src={
												DEVELOPMENT
													? API_URL + profileData.avatar
													: profileData.avatar
											}
											alt=""
										/>
									)}
								</div>
								{sidebarExpand && (
									<div className="ml-3 font-mono">
										<p className="text-sm">{loggedInUser.first_name}</p>
										<p
											className="text-xs text-neutral-600 duration-300 hover:text-black
                  dark:text-orange-200 dark:group-hover:text-orange-300"
										>
											Settings
										</p>
									</div>
								)}
							</div>
						</Link>
					</div>
				</div>
			</div>
			{/* Main content */}
			<div
				className={classNames(
					sidebarExpand ? 'md:pl-48' : 'md:pl-24',
					'flex flex-1 flex-col'
				)}
			>
				<div className="md:hidden">
					<div className="fixed inset-x-0 bottom-0 z-10 flex flex-shrink">
						<div className="w-full">
							<nav
								className="flex rounded-tl-xl border-t
               border-orange-300 bg-black
              "
								aria-label="Tabs"
							>
								{navigation.map((tab) => (
									<NavLink
										key={tab.name}
										to={tab.href}
										className={({ isActive }) =>
											classNames(
												isActive
													? 'text-orange-600 dark:text-orange-200'
													: 'hover:bg-linen dark:text-neutral-300 dark:hover:bg-neutral-900 dark:focus:bg-neutral-500',
												'mb-1 flex w-1/4 justify-evenly rounded-xl border-t-2 border-transparent py-3'
											)
										}
										end
									>
										<tab.icon
											className="h-8 w-8 flex-shrink-0"
											aria-hidden="true"
										/>
										<span className="sr-only">{tab.name}</span>
									</NavLink>
								))}
							</nav>
						</div>
					</div>
				</div>
				<main className="scrollbar flex-1 overflow-auto">
					<div className="py-6">
						<div className="mx-auto w-auto px-4 sm:px-6 md:px-8">
							<nav className="mb-5 flex space-x-2" aria-label="Breadcrumb">
								{!noBreadCrumbRoutes.includes(pathArray[0]) && (
									<ol
										className="flex items-center space-x-4 rounded-md
                  border-[1px] border-neutral-900 p-2 shadow-white/20"
									>
										<li>
											<div>
												<Link
													to="/"
													className="text-white duration-300 hover:text-orange-200"
												>
													<HomeIcon
														className="h-5 w-5 flex-shrink-0"
														aria-hidden="true"
													/>
													<span className="sr-only">Home</span>
												</Link>
											</div>
										</li>
										{pathArray.map((page) => (
											<li key={page}>
												<div className="flex items-center">
													<svg
														className="h-5 w-5 flex-shrink-0 text-gray-300"
														xmlns="http://www.w3.org/2000/svg"
														fill="currentColor"
														viewBox="0 0 20 20"
														aria-hidden="true"
													>
														<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
													</svg>
													<span
														className="ml-2 font-mono text-sm font-medium text-orange-200
                          duration-300 hover:text-white"
														aria-current={
															pathname === page ? 'page' : undefined
														}
													>
														{page}
													</span>
												</div>
											</li>
										))}
									</ol>
								)}
								{pathname.includes('profile') && (
									<ol
										className="flex items-center space-x-4 rounded-md
                    border-[1px] border-neutral-900 p-2 shadow-white/20"
									>
										<li>
											<div className="flex items-center">
												<NavLink
													to="/social/circle"
													className="ml-2 flex font-mono text-sm font-medium text-orange-200
                            duration-300 hover:text-white"
													end
												>
													<ArrowLeftIcon
														className="mr-2 h-6 w-5 flex-shrink-0 text-gray-300"
														aria-hidden
													/>
													Circle
												</NavLink>
											</div>
										</li>
									</ol>
								)}
								<span
									className="hidden items-center rounded-md border-[1px] border-neutral-900
                p-2 font-mono text-xs font-medium text-orange-200
                shadow-white/20 duration-500
                hover:text-white md:visible md:flex"
								>
									<kbd
										className={classNames(
											'bg-darkBG mx-1 flex h-6 w-8 items-center justify-center rounded border border-neutral-500 font-semibold sm:mx-2'
										)}
									>
										{checkMacOS() ? (
											<span className="mb-1 text-xl">⌘</span>
										) : (
											<span className="text-xs">Ctrl</span>
										)}
									</kbd>
									+
									<kbd
										className={classNames(
											'bg-darkBG mx-1 flex h-6 w-6 items-center justify-center rounded border border-neutral-500 font-semibold sm:mx-2'
										)}
									>
										K
									</kbd>
								</span>
							</nav>
							{pageTitle === 'Settings' && (
								<>
									<h1 className="text-3xl font-bold">
										{checkIOS() || checkMacOS() ? '⚙' : ''}{' '}
										{loggedInUser.first_name}
										&apos;s Settings
									</h1>
									<hr className="border-1 border-neutral-200 dark:border-neutral-800 xl:my-8" />
								</>
							)}
						</div>
						<div className="mx-auto w-auto px-4 sm:px-6 md:px-8">
							<div className="mb-12 py-4">{children}</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
