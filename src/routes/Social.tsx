import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  XCircleIcon, ChatBubbleBottomCenterIcon, ExclamationTriangleIcon, PlusCircleIcon,
  VideoCameraIcon,
  CalendarIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import classNames from '@/lib/ClassNames.lib';
import {
  altString,
  greenString, redString, warningString, badge, primaryString2,
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

// function to map out comm-separated interests

const genExp = (rawXP: number) => {
  if (rawXP === 1) {
    return 'about a year';
  }
  return `${rawXP} years`;
};

const genIdea = (idea: string) => {
  if (idea.includes('need')) {
    return 'I';
  }
  return 'I am';
};

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

          <div className="border-[1px] dark:border-neutral-900 bg-darkBG2 border-neutral-400 shadow rounded-md lg:w-3/4 w-full">
            <div className="px-4 py-5 sm:p-6 space-y-2">
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
                <h2 className="sm:ml-4 mt-4 font-sans text-2xl sm:text-3xl leading-6 font-black
                 text-neutral-900 dark:text-neutral-100"
                >
                  {profile.first_name}
                  {' '}
                  {profile.last_name}
                  {' '}
                  <div className="inline-flex ml-1 text-neutral-600 dark:text-neutral-400 text-base">
                    {profile.pronouns ? `(${profile.pronouns})` : ''}
                  </div>
                  {profile.video_call_friendly && (
                  <span className="sm:mt-0 sm:mb-0 mt-5 mb-5 block">
                    <div className="-mt-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md
                        text-xs font-medium bg-phthaloGreen text-honeyDew"
                      >
                        👋 Video Call Friendly
                      </span>
                    </div>
                  </span>
                  )}
                </h2>

              </div>
              <div className="sm:ml-24 rounded-lg dark:bg-darkBG
               p-4 text-neutral-800 dark:text-neutral-200
               border-[1px] border-neutral-200 dark:border-neutral-900"
              >
                <div className="font-monoItalic">
                  <p>
                    &quot;
                    {profile.about}
                    &quot;
                  </p>
                </div>
              </div>
              <div className="sm:ml-20 -ml-4 space-y-4 rounded-md pt-4 pl-4 flex flex-col">
                <div className="flex flex-row space-x-2 text-sm">
                  {profile.calendly && (
                  <div className="flex bg-blue-800/20 text-blue-400 p-2 rounded-md">
                    <button
                      type="button"
                      className="flex flex-row space-x-1"
                      onClick={() => window.open(profile.calendly, '_blank')}
                    >
                      <CalendarIcon className="h-6 w-5" aria-hidden="true" />
                      <span className="">Calendly</span>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 24">
                        <path
                          className="fill-blue-400"
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762
                          0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966
                          0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75
                          1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586
                          7-2.777 7 2.476v6.759z"
                        />
                      </svg>
                      <span className="">LinkedIn</span>
                    </button>
                  </div>
                  )}
                </div>
              </div>
              <div className="sm:ml-20 -ml-4 space-y-2 pb-4 rounded-md pl-4 flex flex-col">
                <div className="flex flex-row space-x-2 text-sm sm:text-md font-mono">
                  {profile.languages && badge(
                    profile.languages,
                    'bg-darkBG font-medium text-amber-200',
                  )}
                </div>

                {/* TODO: add GITHUB */}
                <div className="flex flex-row space-x-2 text-sm sm:text-md">
                  {(profile.location && profile.location !== 'Other')
                      && (
                      <div className="flex bg-darkBG text-amber-200 p-2 rounded-md">
                        🌎
                        {' '}
                        {profile.location}
                      </div>
                      )}
                  <div className="flex bg-darkBG text-amber-200 p-2 rounded-md">
                    🕛
                    {' '}
                    {profile.timezone}
                    {' '}
                    Time
                  </div>
                </div>

              </div>
              <div className="sm:ml-24 rounded-lg dark:bg-darkBG
               p-4 text-neutral-800 dark:text-neutral-200
               border-[1px] border-neutral-200 dark:border-neutral-900"
              >
                <div className="flex flex-col">
                  {/* TODO: add GITHUB */}
                  <div className="space-y-2 bg-darkBG">
                    {!profile.website && (
                    <button
                      type="button"
                      className="flex bg-black
                      p-2 text-sm rounded-sm"
                    >
                      <ArrowUpRightIcon className="h-6 w-4 mr-1" aria-hidden="true" />
                      <a href={profile.website} target="_blank" rel="noreferrer">
                        Link by
                        {' '}
                        {profile.first_name}
                        {' '}
                      </a>
                    </button>
                    )}
                    <span className="block">
                      ⚡
                      {' '}
                      {profile.first_name}
                      {' '}
                      is good at
                      {' '}
                      {profile.dev_type && badge(
                        profile.dev_type,
                        'lg:ml-1 bg-darkBG2 text-sm font-mono font-medium text-amber-200',
                      )}
                      {' '}
                    </span>
                    <span className="block">
                      🧲 Interested in working with
                      {' '}
                      {profile.preferred_dev_type}
                      {' '}
                      developers.
                    </span>
                    <span className="block">
                      ⚒️ Hacking stuff together for
                      {' '}
                      {profile.raw_xp && genExp(profile.raw_xp)}
                      {' '}
                      now.
                    </span>

                  </div>
                </div>
              </div>
              <div className="sm:ml-24 rounded-lg dark:bg-darkBG
               p-4 text-neutral-800 dark:text-neutral-200
               border-[1px] border-neutral-200 dark:border-neutral-900"
              >
                <div className="flex flex-col">
                  <div className="space-y-2 font-monoItalic bg-darkBG">
                    <span className="block">
                      &quot;
                      {profile.idea_status && genIdea(profile.idea_status)}
                      {' '}
                      <span className="lowercase">
                        {profile.idea_status}
                      </span>
                      &quot;
                    </span>
                  </div>
                </div>
              </div>
              <div className="sm:ml-24 rounded-lg dark:bg-darkBG
               p-4 text-neutral-800 dark:text-neutral-200
               border-[1px] border-neutral-200 dark:border-neutral-900"
              >
                <div className="flex flex-col">
                  <div className="space-y-2 bg-darkBG">
                    {profile.purpose && (
                    <span className="block space-y-2">
                      <span className="flex">
                        Why is
                        {' '}
                        {profile.first_name}
                        {' '}
                        here?
                      </span>
                      <span className="flex space-x-2">
                        {badge(profile.purpose, 'bg-darkBG2 text-sm font-mono font-medium text-amber-200')}
                      </span>
                    </span>
                    )}
                  </div>

                </div>
              </div>
              <div className="sm:ml-24 text-md pt-4 space-x-2 justify-start flex">
                <div className="flex flex-col">
                  <button
                    type="button"
                    className={primaryString2}
                  >
                    <ChatBubbleBottomCenterIcon className="h-8 w-6 mr-2" aria-hidden="true" />
                    Chat
                  </button>
                </div>
                <div className="flex flex-col">
                  <button
                    type="button"
                    className={primaryString2}
                  >
                    <VideoCameraIcon className="h-8 w-6 mr-2" aria-hidden="true" />
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative p-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-neutral-100 dark:border-neutral-900" />
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
        <div className="p-3 text-sm shadow-2xl rounded-md shadow-white/20">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={classNames(
                  (tab.href === pathname) || (`${tab.href}/` === pathname)
                    ? 'dark:bg-white dark:text-black bg-orange-700/30 text-orange-900'
                    : 'dark:text-neutral-400 dark:hover:text-neutral-100 text-neutral-600 hover:text-neutral-900',
                  'px-2 py-2 font-sans font-bold uppercase text-base rounded-md',
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
            <h2 className="font-sans text-2xl leading-6 font-black text-neutral-900 dark:text-neutral-100">
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
                className={altString}
              >
                <ChatBubbleBottomCenterIcon className="h-6 w-5 mr-2" aria-hidden="true" />
                Chat with John
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
