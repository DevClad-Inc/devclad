/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  FireIcon,
  FolderIcon,
  HomeIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import { Link, NavLink } from 'react-router-dom';
import DevCladLogo from '../assets/devclad.svg';
import ToggleTheme from './ToggleTheme';
import { useUserContext } from '../context/User.context';

const navigation = [
  {
    name: 'Dashboard', href: '/', icon: HomeIcon,
  },
  {
    name: 'Social', href: '/social', icon: UsersIcon,
  },
  {
    name: 'Projects', href: '/projects', icon: FolderIcon,
  },
  {
    name: 'Hackathons', href: '/hackathons', icon: FireIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loggedInUser = useUserContext();
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
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
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
                            ? 'bg-indigo-800 text-white'
                            : 'text-white hover:bg-indigo-600 hover:bg-opacity-75',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                        )}
                      >
                        <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                  <Link
                    to="/settings"
                    onClick={() => setSidebarOpen(false)}
                    className="flex-shrink-0 group block"
                  >
                    <div className="flex items-center">
                      <div>
                        <img
                          className="inline-block h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-white">{loggedInUser.first_name}</p>
                        <p className="text-sm font-medium text-indigo-200 group-hover:text-white">View profile</p>
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
              <img
                className="h-32 m-auto w-auto shadow-md rounded-full"
                src={DevCladLogo}
                alt="DevClad"
              />
            </div>
            <nav className="mt-10 flex-1 px-2 space-y-2 overflow-auto">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive
                      ? ' text-orange-700 dark:text-fuchsia-400 dark:bg-darkBG'
                      : '',
                    'duration-500 font-sans subpixel-antialiased tracking-tight font-bold group flex items-center px-4 py-4 text-md rounded-lg hover:shadow-md hover:shadow-fuchsia-700/20 uppercase',
                  )}
                >
                  <item.icon className="mr-3 flex-shrink-1 stroke-2 h-8 w-6" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
              <div className="flex items-center justify-center">
                <ToggleTheme />
              </div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <Link to="/settings" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{loggedInUser.first_name}</p>
                  <p className="text-xs font-medium text-indigo-200 group-hover:text-white">View profile</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="md:pl-48 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="w-auto mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
            <div className="w-auto mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg h-96">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
