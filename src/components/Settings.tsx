import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  UserCircleIcon, KeyIcon,
  CreditCardIcon, UsersIcon,
} from '@heroicons/react/24/solid';
import ToggleTheme from './ToggleTheme';
import UpdateProfileForm, { AvatarUploadForm } from './forms/Profile.forms';
import UpdateUserForm from './forms/UpdateUser.forms';
import useDocumentTitle from '../utils/useDocumentTitle';
import SocialProfileForm from './forms/SocialProfile.forms';
import PasswordResetForm from './forms/ResetPassword.forms';
import ChangeEmailForm from './forms/ChangeEmail.forms';

const navigation = [
  {
    name: 'Account/Profile', href: '/settings', icon: UserCircleIcon,
  },
  {
    name: 'Social Preferences', href: '/settings/social', icon: UsersIcon,
  },
  {
    name: 'Email/Password', href: '/settings/password', icon: KeyIcon,
  },
  {
    name: 'Plan & Billing', href: '/billing', icon: CreditCardIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const activeClass = `bg-gray-50 dark:bg-raisinBlack2
                    hover:text-gray-700 dark:hover:text-fuchsia-400
                    dark:text-fuchsia-300
                    text-orange-700`;

export function Settings() {
  useDocumentTitle('Settings');
  const { pathname } = useLocation();
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
      <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
        <div className="flex items-center pb-5">
          <span className="mr-2 text-xs font-black italic font-sans">Dark Mode</span>
          <ToggleTheme />
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={classNames(
                (item.href === pathname) || (`${item.href}/` === pathname)
                  ? activeClass
                  : 'text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800 hover:bg-white',
                'group rounded-md px-3 py-2 flex items-center text-sm font-medium ',
              )}
              aria-current={(pathname === item.href) ? 'page' : undefined}
            >
              <item.icon
                className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
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

// todo : appearance instead of just a dark mode toggle

export function AccountProfile() {
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Account</h2>
          </div>
          <UpdateUserForm />
          <hr className="my-6 border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Profile</h2>
          </div>
          <UpdateProfileForm />
        </div>
        <div className="py-6 px-4 space-y-6 sm:p-6">
          <AvatarUploadForm />
        </div>
      </div>
    </div>
  );
}

export function SocialProfile() {
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Social Preferences</h2>
            <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
              We use your preferences in our ML algorithms to
              generate the best possible match every week.
            </p>
          </div>
          <SocialProfileForm />
          <hr className="my-6 border-t border-gray-200 dark:border-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function Password() {
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Email</h2>
          </div>
          <ChangeEmailForm />
          <hr className="my-6 border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Password</h2>
          </div>
          <PasswordResetForm />
          <hr className="my-6 border-t border-gray-200 dark:border-gray-800" />
        </div>
      </div>
    </div>
  );
}
