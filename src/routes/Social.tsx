import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  XCircleIcon, ChatBubbleBottomCenterIcon, ExclamationTriangleIcon, PlusCircleIcon,
  VideoCameraIcon,
  CalendarIcon,
} from '@heroicons/react/24/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import classNames from '@/lib/ClassNames.lib';
import {
  monoString,
  greenString, redString, warningString,
} from '@/lib/Buttons.lib';
import { useOneOneProfile, useOneOneUsernames } from '@/services/socialHooks.services';
import {
  initialUserState, MatchProfile, User,
} from '@/lib/InterfacesStates.lib';
import { userQuery } from '@/lib/queriesAndLoaders';
import LoadingCard from '@/components/LoadingCard';

const tabs = [
  { name: '1-on-1', href: '/social' },
  { name: 'Circle', href: '/social/circle' },
];

function MatchCard({ username }:{ username:string }): JSX.Element {
  const profile = useOneOneProfile(username) as MatchProfile;
  const qc = useQueryClient();
  const state = qc.getQueryState(['profile', username]);
  if ((state?.status === 'loading' || state?.status !== 'success') || profile === null) {
    return (
      <LoadingCard />
    );
  }
  if (profile) {
    return (
      <div>
        <div className="justify-center flex p-0 lg:p-4">

          <div className="dark:bg-darkBG shadow rounded-lg lg:w-3/4 w-full">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:inline-flex">
                <div className="flex flex-col">
                  <div className="flex-shrink-0">
                    <img
                      className="object-cover h-32 w-32 sm:h-24 sm:w-24 rounded-full bg-linen"
                      src={
                import.meta.env.VITE_DEVELOPMENT
                  ? (import.meta.env.VITE_API_URL + profile.avatar)
                  : profile.avatar
              }
                      alt=""
                    />
                  </div>
                </div>
                <h2 className="ml-4 mt-8 font-display text-3xl leading-6 font-medium text-neutral-900 dark:text-neutral-100">
                  {profile.first_name}
                  {' '}
                  {profile.last_name}
                  {' '}
                  <div className="inline-flex ml-1 text-neutral-600 dark:text-neutral-400 text-base">
                    {profile.pronouns ? `(${profile.pronouns})` : ''}
                  </div>
                </h2>
              </div>
              <div className="sm:ml-24 mt-4 sm:mt-0 text-lg rounded-lg dark:bg-black/50
               p-4 text-neutral-800 dark:text-neutral-200"
              >
                <div className="font-monoItalic">
                  <p>
                    &quot;
                    {profile.about}
                    &quot;
                  </p>
                </div>
              </div>
              <div className="sm:ml-20 -ml-4 space-y-4 rounded-md p-4 flex flex-col">
                {/* TODO: add GITHUB */}
                <div className="flex flex-row space-x-2 text-sm sm:text-lg">
                  {(profile.location && profile.location !== 'Other')
                      && (
                      <div className="flex bg-black/50 text-amber-200 p-2 rounded-md">
                        🌎
                        {' '}
                        {profile.location}
                      </div>
                      )}
                  <div className="flex bg-black/50 text-amber-200 p-2 rounded-md">
                    🕛
                    {' '}
                    {profile.timezone}
                  </div>
                </div>

                <div className="flex flex-row space-x-2 text-lg">
                  {profile.calendly && (
                  <div className="flex bg-blue-800/20 text-blue-400 p-2 rounded-md">
                    <button
                      type="button"
                      className="flex flex-row space-x-2"
                      onClick={() => window.open(profile.calendly, '_blank')}
                    >
                      <CalendarIcon className="h-8 w-6" aria-hidden="true" />
                      <span className="font-medium">Calendly</span>
                    </button>
                  </div>
                  )}
                  {profile.linkedin && (
                  <div className="flex bg-blue-800/20 text-blue-400 p-2 rounded-md">
                    <button
                      type="button"
                      className="flex flex-row"
                      onClick={() => window.open(profile.linkedin, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 24">
                        <path
                          className="fill-blue-400"
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762
                          0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966
                          0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75
                          1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586
                          7-2.777 7 2.476v6.759z"
                        />
                      </svg>
                      <span className="font-medium">LinkedIn</span>
                    </button>
                  </div>
                  )}
                </div>
              </div>
              <div className="sm:ml-24 text-lg rounded-lg dark:bg-black/50
               p-4 text-neutral-800 dark:text-neutral-200"
              >
                <div>
                  <div className="flex flex-col">
                    {/* TODO: add GITHUB */}

                    <div className=" ">{profile.dev_type}</div>
                    <div className=" ">{profile.preferred_dev_type}</div>
                    <div className=" ">{profile.idea_status}</div>
                    <div className="">{profile.video_call_friendly === true ? 'Video Call Friendly' : 'Not Video Call Friendly'}</div>
                    <div className="">{profile.languages}</div>
                    <div className="">{profile.raw_xp}</div>
                    <div className="">{profile.website}</div>
                    <div className="">{profile.purpose}</div>
                  </div>
                </div>
              </div>
              <div className="lg:ml-24 justify-start mt-5 flex">
                <div className="flex flex-col mr-2">
                  <button
                    type="button"
                    className={monoString}
                  >
                    <ChatBubbleBottomCenterIcon className="h-6 w-5 mr-2" aria-hidden="true" />
                    Chat
                  </button>
                </div>
                <div className="flex flex-col">
                  <button
                    type="button"
                    className={monoString}
                  >
                    <VideoCameraIcon className="h-6 w-5 mr-2" aria-hidden="true" />
                    Schedule Meeting
                  </button>
                </div>
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
      </div>
    );
  }
  return <div />;
}

export default function Social(): JSX.Element {
  useDocumentTitle('Social Mode');
  const qc = useQueryClient();
  const { usernames } = useOneOneUsernames();
  let loggedInUser: User = { ...initialUserState };
  const {
    data: userQueryData,
    isSuccess: userQuerySuccess,
  } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
  }
  const { pathname } = useLocation();
  const state = qc.getQueryState(['matches']);
  return (
    <>
      <div className="justify-center flex mb-4">
        <div className="p-3 text-sm dark:bg-darkBG bg-orange-50 rounded-lg">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={classNames(
                  (tab.href === pathname) || (`${tab.href}/` === pathname)
                    ? 'dark:bg-orange-900/20 dark:text-orange-300 bg-orange-700/30 text-orange-900'
                    : 'dark:text-neutral-400 dark:hover:text-neutral-100 text-neutral-600 hover:text-neutral-900',
                  'px-2 py-2 font-bold text-base rounded-md',
                )}
                aria-current={tab.href ? 'page' : undefined}
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <span className=" hidden">
        {' '}
        {loggedInUser.username}
        {' '}
      </span>

      {
       ((state?.status === 'loading' || state?.status !== 'success') || usernames === null) && (
       <LoadingCard />
       )
       }
      {
        usernames?.map((username) => (
          <MatchCard key={username} username={username} />
        ))
      }
      <div className="justify-center flex p-4">

        <div className="dark:bg-darkBG shadow rounded-lg md:w-3/4 sm:w-full">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="font-display text-2xl leading-6 font-medium text-neutral-900 dark:text-neutral-100">
              Prompts for Conversation/Tips
            </h2>
            <div className="pt-5 text-md text-neutral-800 dark:text-neutral-200">
              <p>
                Since you suck at making conversation and don&apos; get bitches,
                here are some prompts to spark a conversation.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className={monoString}
              >
                <ChatBubbleBottomCenterIcon className="h-6 w-5 mr-2" aria-hidden="true" />
                Chat with John
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="justify-center flex p-4">

        <div className="dark:bg-darkBG shadow rounded-lg md:w-3/4 sm:w-full">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="font-display text-2xl leading-6 font-medium text-neutral-900 dark:text-neutral-100">
              Things to know
            </h2>
            <div className="pt-5 text-md text-neutral-800 dark:text-neutral-200">
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
