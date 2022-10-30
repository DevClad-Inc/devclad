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
import UpdateProfileForm, { AvatarUploadForm } from '@/components/forms/Profile.forms';
import UpdateUserForm from '@/components/forms/UpdateUser.forms';
import { SocialProfileForm } from '@/components/forms/SocialProfile.forms';
import { AdditionalSPForm } from '@/components/forms/AdditionalSP.forms';
import PasswordResetForm from '@/components/forms/ResetPassword.forms';
import ChangeEmailForm from '@/components/forms/ChangeEmail.forms';

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
		name: 'Email/Password',
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
					dark:hover:text-orange-400 dark:text-orange-300 text-orange-700`;

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
							Advanced Preferences
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
	return (
		<div className="sm:px-6 lg:col-span-9 lg:px-0">
			<div className="space-y-6 shadow sm:overflow-hidden sm:rounded-md">
				<div className="bg-darkBG2 space-y-6 rounded-md border-[1px] py-6 px-4 dark:border-neutral-800 sm:p-6">
					<div className="inline-flex">
						<EnvelopeIcon className="mr-2 h-6 w-6" />
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
			</div>
		</div>
	);
}
