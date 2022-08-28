import React from 'react';
import {
  CreditCardIcon, KeyIcon, UserCircleIcon,
} from '@heroicons/react/outline';
import { UpdateUserForm } from './forms/AuthForms';
// import { useUserContext } from '../context/User.context';
import { Error } from '../utils/Feedback';

const navigation = [
  {
    name: 'Account', href: '#', icon: UserCircleIcon, current: true,
  },
  {
    name: 'Password', href: '#', icon: KeyIcon, current: false,
  },
  {
    name: 'Plan & Billing', href: '#', icon: CreditCardIcon, current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function NewSettings() {
//   const loggedInUser = useUserContext();
  const [updateUserError, setUpdateUserError] = React.useState('');
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
      <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white'
                  : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                'group rounded-md px-3 py-2 flex items-center text-sm font-medium',
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? 'text-indigo-500 group-hover:text-indigo-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">

        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Account</h3>
            </div>
            {updateUserError && (
            <Error error={updateUserError} />
            )}
            <UpdateUserForm
              updateErrorState={updateUserError}
              setUpdateErrorState={setUpdateUserError}
            />
          </div>
          <div className="py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3">
                {/* <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  About
                </label> */}
                <div className="mt-1">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="you@example.com"
                    defaultValue=""
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>
              <div className="col-span-6 sm:col-span-3">
                {/* <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label> */}
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>

              <div className="col-span-3">
                {/* <label className="block text-sm font-medium text-gray-700">Photo</label> */}
                <div className="mt-1 flex items-center">
                  <span className="inline-block bg-gray-100 dark:bg-gray-500 rounded-full overflow-hidden h-12 w-12">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <button
                    type="button"
                    className="ml-5 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="col-span-3">
                {/* <label className="block text-sm font-medium
                text-gray-700">Cover photo</label> */}
                <div className="mt-1 border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
