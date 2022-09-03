import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  UserCircleIcon, KeyIcon, CreditCardIcon,
} from '@heroicons/react/24/solid';
import ToggleTheme from './ToggleTheme';
import UpdateProfileForm, { AvatarUploadForm } from './forms/Profile.forms';
import UpdateUserForm from './forms/UpdateUser.forms';
import useDocumentTitle from '../utils/useDocumentTitle';

const navigation = [
  {
    name: 'Account', href: '/settings', icon: UserCircleIcon, current: true,
  },
  {
    name: 'Password', href: '/password', icon: KeyIcon, current: false,
  },
  {
    name: 'Plan & Billing', href: '/billing', icon: CreditCardIcon, current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Settings() {
  useDocumentTitle('Settings');
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
              className={({ isActive }) => classNames(
                isActive
                  ? 'bg-gray-50 dark:bg-raisinBlack2 dark:hover:bg-gray-200 hover:text-gray-700'
                  : 'text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800 hover:bg-white',
                'group rounded-md px-3 py-2 flex items-center text-sm font-medium ',
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? 'dark:text-fuchsia-300 dark:group-hover:text-fuchsia-500 text-orange-700 group-hover:text-orange-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                )}
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
