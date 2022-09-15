import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  XCircleIcon, ChatBubbleBottomCenterIcon, ExclamationTriangleIcon, PlusCircleIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/solid';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import classNames from '@/lib/ClassNames.lib';
import { Profile, initialProfileState } from '@/lib/InterfacesStates.lib';
import {
  altString,
  greenString, redString, warningString,
} from '@/lib/Buttons.lib';
import { profileQuery } from '@/lib/queriesAndLoaders';

const tabs = [
  { name: '1-on-1', href: '/social' },
  { name: 'Circle', href: '/social/circle' },
];

export default function Social(): JSX.Element {
  useDocumentTitle('Social Mode');
  let profileData: Profile = { ...initialProfileState };
  const {
    data: profileQueryData,
    isSuccess: profileQuerySuccess,
  } = useQuery(profileQuery());
  if (profileQuerySuccess && profileQueryData !== null) {
    profileData = profileQueryData.data;
  }
  const { pathname } = useLocation();
  return (
    <>
      <div className="justify-center flex">
        <div className="p-3 text-sm dark:bg-darkBG2 bg-orange-50 rounded-xl">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={classNames(
                  (tab.href === pathname) || (`${tab.href}/` === pathname)
                    ? 'dark:bg-fuchsia-900/30 dark:text-fuchsia-300 bg-orange-700/30 text-orange-900'
                    : 'dark:text-gray-400 dark:hover:text-gray-100 text-gray-600 hover:text-gray-900',
                  'px-3 py-2 font-medium rounded-md',
                )}
                aria-current={tab.href ? 'page' : undefined}
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="justify-center flex p-4">

        <div className="dark:bg-darkBG2 shadow rounded-xl md:w-3/4 sm:w-full">
          <div className="px-4 py-5 sm:p-6">
            <div className="inline-flex">
              <div className="flex flex-col">
                <div className="flex-shrink-0">
                  <img
                    className="object-cover h-24 w-24 rounded-full bg-linen"
                    src={
                    import.meta.env.VITE_DEVELOPMENT
                      ? (import.meta.env.VITE_API_URL + profileData.avatar)
                      : profileData.avatar
                  }
                    alt=""
                  />
                </div>
              </div>
              <h2 className="ml-4 mt-8 font-display text-2xl leading-6 font-medium text-gray-900 dark:text-gray-100">
                John Doe
              </h2>
            </div>

            <div className="ml-28 text-md text-gray-700 dark:text-gray-300">
              <p>
                Hey, I&apos;m John Doe. I want a programmer friend to inspect my hole.
                Hey, I&apos;m John Doe. I want a programmer friend to inspect my hole.
                Hey, I&apos;m John Doe. I want a programmer friend to inspect my hole.
              </p>
            </div>
            <div className="justify-evenly mt-5 flex">
              <button
                type="button"
                className={altString}
              >
                <ChatBubbleBottomCenterIcon className="h-6 w-5 mr-2" aria-hidden="true" />
                Chat with John
              </button>
              <button
                type="button"
                className={altString}
              >
                <VideoCameraIcon className="h-6 w-5 mr-2" aria-hidden="true" />
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative p-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-100 dark:border-gray-900" />
        </div>
        <div className="relative justify-evenly md:flex hidden sm:hidden md:visible">
          <div className="flex -mt-5 justify-center">
            <button
              type="button"
              className={warningString}
            >
              <ExclamationTriangleIcon className="h-6 w-5 mr-2" aria-hidden="true" />
              <span className="text-xs">Pass For 4 Weeks</span>
            </button>
          </div>
          <div className="flex -mt-5 justify-center">
            <button
              type="button"
              className={greenString}
            >
              <PlusCircleIcon className="h-6 w-5 mr-2" aria-hidden="true" />
              <span>Add To Circle</span>
            </button>
          </div>
          <div className="flex -mt-5 justify-center">
            <button
              type="button"
              className={redString}
            >
              <XCircleIcon className="h-6 w-5 mr-2" aria-hidden="true" />
              <span className="text-xs">Never Show Again</span>
            </button>
          </div>
        </div>
      </div>
      <div className="justify-center flex p-4">

        <div className="dark:bg-darkBG2 shadow rounded-xl md:w-3/4 sm:w-full">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="font-display text-2xl leading-6 font-medium text-gray-900 dark:text-gray-100">
              Prompts for Conversation/Tips
            </h2>
            <div className="pt-5 text-md text-gray-700 dark:text-gray-300">
              <p>
                Since you suck at making conversation and don&apos; get bitches,
                here are some prompts to spark a conversation.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className={altString}
              >
                <ChatBubbleBottomCenterIcon className="h-6 w-5 mr-2" aria-hidden="true" />
                Chat with John
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="justify-center flex p-4">

        <div className="dark:bg-darkBG2 shadow rounded-xl md:w-3/4 sm:w-full">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="font-display text-2xl leading-6 font-medium text-gray-900 dark:text-gray-100">
              Things to know
            </h2>
            <div className="pt-5 text-md text-gray-700 dark:text-gray-300">
              <p>
                Since you suck at making conversation and don&apos; get bitches,
                here are some prompts to spark a conversation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
