import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  HomeIcon, UsersIcon, FireIcon, FolderIcon,
} from '@heroicons/react/24/solid';

import DevCladLogo from '@/assets/devclad.svg';
import classNames from '@/lib/ClassNames.lib';
import {
  Profile, initialProfileState,
  User, initialUserState,
} from '@/lib/InterfacesStates.lib';
import QueryLoader from '@/lib/QueryLoader.lib';
import { profileQuery, userQuery } from '@/lib/queriesAndLoaders';

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
  let loggedInUser: User = { ...initialUserState };
  const {
    data: userQueryData,
    isSuccess: userQuerySuccess,
  } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
  }
  let profileData: Profile = { ...initialProfileState };
  const {
    data: profileQueryData,
    isSuccess: profileQuerySuccess,
  } = useQuery({
    ...profileQuery(),
  });
  if (profileQuerySuccess && profileQueryData !== null) {
    profileData = profileQueryData.data;
  }
  const [sidebarExpand, setSidebarExpand] = React.useState(true);

  const pageTitle = (document.title).slice(10);

  return (
    <div className="h-full flex">
      <div className="hidden md:flex md:w-min md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-orange-50 dark:bg-darkBG2
         border-r-2 border-neutral-900/30"
        >
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
                      ? 'dark:bg-white dark:text-darkBG bg-orange-700/30 text-orange-900'
                      : 'dark:text-neutral-300 dark:hover:text-neutral-100 text-neutral-700 hover:text-neutral-900',
                    sidebarExpand ? 'rounded-md' : 'rounded-xl',
                    'flex items-center px-5 py-3',
                  )}
                  end
                >
                  <item.icon
                    className={classNames(
                      sidebarExpand ? 'mr-3 h-6 w-6' : 'm-auto h-8 w-8',
                      'flex-shrink-1',
                    )}
                    aria-hidden="true"
                  />
                  <span className=" font-bold text-md">{sidebarExpand && item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-orange-400/50 rounded-tl-3xl dark:bg-black p-4">
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
                    <p className="text-xs font-medium text-neutral-600 dark:text-orange-300 hover:text-black
                  dark:group-hover:text-orange-400 duration-300"
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
        <div className="md:hidden">
          <div className="fixed inset-x-0 bottom-0 z-10 flex-shrink flex">
            <div className="w-full">
              <nav
                className="flex backdrop-blur-lg bg-black
               border-t dark:border-orange-300/30 rounded-tl-xl shadow-lg
              "
                aria-label="Tabs"
              >
                {navigation.map((tab) => (
                  <NavLink
                    key={tab.name}
                    to={tab.href}
                    className={({ isActive }) => classNames(
                      isActive
                        ? 'dark:text-orange-300 text-orange-600'
                        : 'dark:text-neutral-300 dark:hover:bg-neutral-900 hover:bg-linen dark:focus:bg-neutral-500',
                      'w-1/4 flex justify-evenly py-3 mb-1 rounded-xl border-t-2 border-transparent',
                    )}
                    end
                  >
                    <tab.icon
                      className="flex-shrink-0 h-8 w-8"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{tab.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-auto scrollbar">
          <div className="py-6">
            {(pageTitle !== 'Social Mode') && (pageTitle !== 'Hackathons') && (pageTitle !== 'Projects') ? (
              <div className="w-auto mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-display font-bold tracking-wider uppercase">
                  {pageTitle}
                </h1>
                <hr className="my-6 border-1 border-gray-200 dark:border-gray-800" />
              </div>
            ) : null}
            <div className="w-auto mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4 mb-12">
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
