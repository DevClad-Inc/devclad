import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
	UserCircleIcon,
	KeyIcon,
	CreditCardIcon,
	UsersIcon,
	EnvelopeIcon,
} from '@heroicons/react/24/solid';
import { useDocumentTitle } from '@devclad/lib';
import { useQueryClient } from '@tanstack/react-query';
import UpdateProfileForm, { AvatarUploadForm } from '@/components/forms/Profile.forms';
import UpdateUserForm from '@/components/forms/UpdateUser.forms';
import { SocialProfileForm } from '@/components/forms/SocialProfile.forms';
import { AdditionalSPForm } from '@/components/forms/AdditionalSP.forms';
import PasswordResetForm from '@/components/forms/ResetPassword.forms';
import ChangeEmailForm from '@/components/forms/ChangeEmail.forms';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { useGithubOAuth } from '@/services/useAuth.services';
import { connectGithub } from '@/services/github.services';

const navigation = [
	{
		name: 'Account',
		href: '/settings',
		icon: UserCircleIcon,
	},
	{
		name: 'Social Preferences',
		href: '/settings/social',
		icon: UsersIcon,
	},
	{
		name: 'Login & Security',
		href: '/settings/password',
		icon: KeyIcon,
	},
	{
		name: 'Plan & Billing',
		href: '/billing',
		icon: CreditCardIcon,
	},
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const activeClass = `bg-neutral-50 dark:bg-darkBG2 hover:text-neutral-700
					dark:hover:text-orange-300 dark:text-orange-200 text-orange-700`;

export function Settings() {
	useDocumentTitle('Settings');
	const { pathname } = useLocation();
	return (
		<div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
			<aside className=" py-6 px-0 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
				<nav
					className="bg-snow dark:bg-darkBG2 space-y-1 rounded-md
        border-[1px] p-4 dark:border-neutral-800"
				>
					{navigation.map((item) => (
						<NavLink
							key={item.name}
							to={item.href}
							className={classNames(
								item.href === pathname || `${item.href}/` === pathname
									? activeClass
									: 'dark:hover:bg-darkBG text-neutral-900 hover:bg-white hover:text-neutral-900 dark:text-neutral-100 dark:hover:text-white',
								'group flex items-center rounded-md px-3 py-2 text-sm'
							)}
							aria-current={pathname === item.href ? 'page' : undefined}
						>
							<item.icon
								className="-ml-1 mr-3 h-6 w-6 flex-shrink-0"
								aria-hidden="true"
							/>
							<span className="truncate">{item.name}</span>
						</NavLink>
					))}
				</nav>
			</aside>
			<Outlet />
		</div>
	);
}

export function AccountProfile() {
	return (
		<div className="sm:px-6 lg:col-span-9 lg:px-0">
			<div className="space-y-6 shadow sm:overflow-hidden sm:rounded-md">
				<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
					<div>
						<h2 className="font-sans text-2xl leading-6 text-neutral-900 dark:text-neutral-100 sm:text-3xl">
							Account
						</h2>
					</div>
					<UpdateUserForm />
				</div>
				<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
					<div>
						<h2 className="font-sans text-2xl leading-6 text-neutral-900 dark:text-neutral-100 sm:text-3xl">
							Profile
						</h2>
					</div>
					<UpdateProfileForm />
				</div>
				<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
					<AvatarUploadForm />
				</div>
			</div>
		</div>
	);
}

export function SocialProfile() {
	return (
		<div className="sm:px-6 lg:col-span-9 lg:px-0">
			<div className="space-y-6 shadow sm:overflow-hidden sm:rounded-md">
				<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
					<div>
						<h2 className="font-sans text-2xl leading-6 text-neutral-900 dark:text-neutral-100 sm:text-3xl">
							Basic Preferences
						</h2>
					</div>
					<AdditionalSPForm />
				</div>
				<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
					<div>
						<h2 className="font-sans text-2xl leading-6 text-neutral-900 dark:text-neutral-100 sm:text-3xl">
							Details + Advanced Preferences
						</h2>
						<p className="mt-2 text-xs italic text-neutral-600 dark:text-neutral-400">
							We use your preferences in our ML algorithms to generate the best
							possible match every week.
						</p>
					</div>
					<SocialProfileForm />
				</div>
			</div>
		</div>
	);
}

export function Password() {
	const [githubLogin, setGithubLogin] = React.useState(false);
	const { username } = useGithubOAuth();
	const qc = useQueryClient();

	const state = qc.getQueryState(['githubData'])?.status;

	if (state === 'success' && username !== '' && !githubLogin) {
		setGithubLogin(true);
	}

	if (state === 'success') {
		return (
			<div className="sm:px-6 lg:col-span-9 lg:px-0">
				<div className="space-y-6 shadow sm:overflow-hidden sm:rounded-md">
					<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
						<div className="inline-flex">
							<EnvelopeIcon className="mr-2 h-6 w-6 sm:h-12" />
							<h2 className="font-sans text-2xl leading-6 text-neutral-900 dark:text-neutral-100 sm:text-3xl">
								Email{' '}
							</h2>
						</div>
						<ChangeEmailForm />
					</div>
					<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
						<div className="inline-flex">
							<KeyIcon className="mr-2 h-6 w-6" />
							<h2 className="font-sans text-3xl leading-6 text-neutral-900 dark:text-neutral-100">
								Password
							</h2>
						</div>
						<PasswordResetForm />
					</div>
					<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
						<div className="inline-flex">
							<KeyIcon className="mr-2 h-6 w-6" />
							<h2 className="font-sans text-3xl leading-6 text-neutral-900 dark:text-neutral-100">
								Connect Github
							</h2>
						</div>
						<div className="mt-6">
							<PrimaryButton
								onClick={() => {
									if (githubLogin && username !== '') {
										connectGithub();
									} else {
										window.location.href = '/api/auth/connect/github/';
									}
								}}
							>
								<svg
									className="mr-2 h-6 w-4 sm:h-8 sm:w-5"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="text-sm sm:text-lg">
									{githubLogin && username !== '' && (
										<span>Connected as {username}</span>
									)}
									{githubLogin && username === '' && <span>Connecting...</span>}
									{!githubLogin && <span>Connect Github</span>}
								</span>
							</PrimaryButton>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return <div className="sm:px-6 lg:col-span-9">Loading...</div>;
}
