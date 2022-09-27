import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  HomeIcon, UsersIcon, FireIcon, FolderIcon,
} from '@heroicons/react/24/outline';

import DevCladLogo from '@/assets/devclad.svg';
import classNames from '@/lib/ClassNames.lib';
import {
  Profile, initialProfileState,
  User, initialUserState,
} from '@/lib/InterfacesStates.lib';
import QueryLoader from '@/lib/QueryLoader.lib';
import { profileQuery, userQuery } from '@/lib/queriesAndLoaders';
import CheckChild from '@/lib/CheckChild.lib';
import { checkIOS, checkMacOS } from '@/lib/CheckDevice.lib';

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

  const [sidebarExpand, setSidebarExpand] = React.useState(false);

  const pageTitle = (document.title).slice(10);

  const { pathname } = useLocation();
  const pathArray = pathname.split('/');
  pathArray.shift();
  return (
    <div className="h-full flex">
      <div className="hidden md:flex md:w-min md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-orange-50 dark:bg-darkBG2
         border-l-0 border-r-2 border-white/5 "
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
                    isActive || CheckChild(pathname, item.href)
                      ? 'dark:text-white text-orange-900'
                      : 'dark:text-neutral-700 dark:hover:text-neutral-100',
                    sidebarExpand ? 'rounded-none' : 'rounded-lg',
                    'flex items-center px-5 py-3 duration-300',
                  )}
                  end
                >
                  <item.icon
                    className={classNames(
                      sidebarExpand ? 'mr-3 h-8 w-8' : 'm-auto h-8 w-8',
                      'flex-shrink-1 stroke-2',
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-md font-mono font-bold">{sidebarExpand && item.name}</span>
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
                  <div className="ml-3 font-mono">
                    <p className="text-sm">{loggedInUser.first_name}</p>
                    <p className="text-xs text-neutral-600 dark:text-orange-300 hover:text-black
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
            <div className="w-auto mx-auto px-4 sm:px-6 md:px-8">
              {(pageTitle !== 'Dashboard') && (
              <nav className="flex mb-5 space-x-2" aria-label="Breadcrumb">
                <ol className="flex border-[1px] rounded-md p-2
                  shadow-2xl shadow-white/20
                 border-neutral-200 dark:border-neutral-900 items-center space-x-4"
                >
                  <li>
                    <div>
                      <Link to="/" className="text-white hover:text-orange-300 duration-300">
                        <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
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
                        <NavLink
                          to={page === '' ? '/' : `/${page}`}
                          className="ml-2 text-sm font-mono font-medium text-orange-300
                          hover:text-white duration-300"
                          aria-current={(pathname === page) ? 'page' : undefined}
                          end
                        >
                          {page}
                        </NavLink>
                      </div>
                    </li>
                  ))}
                </ol>
                <span
                  className="md:flex border-[1px] rounded-md p-2 hidden md:visible
                shadow-2xl shadow-white/20 text-xs font-mono font-medium text-orange-300
                hover:text-white duration-300
                border-neutral-200 dark:border-neutral-900 items-center"
                >
                  <kbd className={classNames(
                    'mx-1 flex h-6 w-8 items-center justify-center rounded border border-neutral-500 bg-darkBG font-semibold sm:mx-2',
                  )}
                  >
                    {checkMacOS()
                      ? <span className="text-lg">⌘</span>
                      : <span className="text-xs">Ctrl</span>}
                  </kbd>
                  +
                  <kbd className={classNames(
                    'mx-1 flex h-6 w-6 items-center justify-center rounded border border-neutral-500 bg-darkBG font-semibold sm:mx-2',
                  )}
                  >
                    K
                  </kbd>
                </span>
              </nav>
              )}
              {(pageTitle === 'Settings') && (
              <>
                <h1 className="text-3xl font-bold">
                  {(checkIOS() || checkMacOS()) ? '⚙' : ''}
                  {' '}
                  {loggedInUser.first_name}
                  &apos;s Settings
                </h1>
                <hr className="my-8 border-1 border-neutral-200 dark:border-neutral-900" />
              </>
              )}
            </div>
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
