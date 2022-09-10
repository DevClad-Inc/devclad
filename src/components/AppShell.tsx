import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link, NavLink } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  HomeIcon, UsersIcon, FireIcon, FolderIcon, XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/solid';

import DevCladLogo from '../assets/devclad.svg';
import { useUserContext } from '../context/User.context';
import classNames from '../utils/ClassNames.utils';
import { getUser } from '../services/auth.services';
import { getProfile } from '../services/profile.services';
import {
  Profile, initialProfileState,
  User, initialUserState,
} from '../utils/InterfacesStates.utils';
import QueryLoader from '../utils/QueryLoader.utils';

const navigation = [
  {
    name: 'Dashboard', href: '/', icon: HomeIcon, alt: 'Home',
  },
  {
    name: 'Social', href: '/social', icon: UsersIcon, alt: 'Social',
  },
  {
    name: 'Hackathons', href: '/hackathons', icon: FireIcon, alt: 'Hackathons',
  },
  {
    name: 'Projects', href: '/projects', icon: FolderIcon, alt: 'Projects',
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const contextUser = useUserContext();
  // why not context for the user?
  // context doesn't sync changes across different browser tabs
  let loggedInUser: User = { ...initialUserState };
  const userQuery = useQuery(['user'], () => getUser());
  if (userQuery.isSuccess && userQuery.data !== null) {
    const { data } = userQuery;
    loggedInUser = data.data;
  }
  let profileData: Profile = { ...initialProfileState };
  const profileQuery = useQuery(['profile'], () => getProfile());
  if (profileQuery.isSuccess && profileQuery.data !== null) {
    const { data } = profileQuery;
    profileData = data.data;
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpand, setSidebarExpand] = useState(true);

  // why context here?
  // because it still tells us if the user is not undefined when we lose tab focus
  if (Object.values(contextUser).every((value) => value === undefined)) {
    return (
      null
    );
  }

  const pageTitle = (document.title).slice(10);

  return (
    <div className="h-full flex">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10
                      rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto scrollbar">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img
                      className="mx-auto h-24 w-auto"
                      src={DevCladLogo}
                      alt="DevClad"
                    />
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => classNames(
                          isActive
                            ? 'bg-fuchsia-800'
                            : 'hover:bg-fuchsia-600 hover:bg-opacity-75',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                        )}
                      >
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6 text-fuchsia-300"
                          aria-hidden="true"
                        />

                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
                </div>
                <div
                  onMouseEnter={() => { qc.prefetchQuery(['profile']); }}
                  className="flex-shrink-0 flex border-t border-fuchsia-800 p-4"
                >
                  <Link
                    to="/settings"
                    onClick={() => setSidebarOpen(false)}
                    className="flex-shrink-0 group block"
                  >
                    <div className="flex items-center">
                      <div>
                        <img
                          className="inline-block h-10 w-10 rounded-full bg-white"
                          src={
                            import.meta.env.VITE_DEVELOPMENT
                              ? (import.meta.env.VITE_API_URL + profileData.avatar)
                              : profileData.avatar
                          }
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium">{loggedInUser && loggedInUser.first_name}</p>
                        <p className="text-sm font-medium text-indigo-200 group-hover:text-white">Settings</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-min md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-orange-50 dark:bg-darkBG2">
          <div className="flex-1 flex flex-col pt-5 overflow-y-hidden">
            <div className="flex items-center flex-shrink-0 px-2">
              <button type="button" onClick={() => setSidebarExpand(!sidebarExpand)} className="m-auto">
                <img
                  className="h-24 m-auto w-auto rounded-full"
                  src={DevCladLogo}
                  alt="DevClad"
                />
              </button>
            </div>
            <nav className={classNames(
              sidebarExpand
                ? 'space-y-4'
                : 'space-y-24',
              'mt-10 flex-1 px-2 overflow-auto scrollbar',
            )}
            >
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive
                      ? 'text-orange-700 dark:text-fuchsia-300 dark:group-hover:text-fuchsia-500'
                      : 'text-gray-800 dark:text-gray-200 group-hover:text-gray-500',
                    sidebarExpand ? 'rounded-md duration-500' : 'rounded-2xl duration-700',
                    'uppercase font-black flex items-center text-sm px-4 py-2',
                  )}
                >
                  <item.icon
                    className={classNames(
                      sidebarExpand ? 'mr-3 h-6 w-6' : 'm-auto h-8 w-8',
                      'flex-shrink-1',
                    )}
                    aria-hidden="true"
                  />
                  {sidebarExpand && item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-fuchsia-400/50 rounded-tl-3xl dark:bg-darkBG p-4">
            <Link to="/settings" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block object-cover h-12 w-12 rounded-full bg-linen"
                    src={
                      import.meta.env.VITE_DEVELOPMENT
                        ? (import.meta.env.VITE_API_URL + profileData.avatar)
                        : profileData.avatar
                    }
                    alt=""
                  />
                </div>
                {sidebarExpand && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">{loggedInUser.first_name}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-fuchsia-300 hover:text-black
                  dark:group-hover:text-fuchsia-400 duration-300"
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
      <div className={classNames(
        sidebarExpand ? 'md:pl-48' : 'md:pl-24',
        'flex flex-col flex-1',
      )}
      >
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-transparent backdrop-blur-sm">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-transparent"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 overflow-auto scrollbar">
          <div className="py-6">
            <div className="w-auto mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-display font-bold tracking-wider uppercase">
                {pageTitle}
              </h1>
              <hr className="my-6 border-1 border-gray-200 dark:border-gray-800" />
            </div>
            <div className="w-auto mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <QueryLoader />
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
