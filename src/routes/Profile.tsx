import React from 'react';
import {
  XCircleIcon,
  ChatBubbleBottomCenterIcon,
  VideoCameraIcon,
  CalendarIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import { badge, primaryString2 } from '@/lib/Buttons.lib';
import { useOneOneProfile } from '@/services/socialHooks.services';
import { MatchProfile } from '@/lib/InterfacesStates.lib';
import LoadingCard from '@/components/LoadingCard';
import ActionDropdown from '@/components/ActionDropdown';

export const genExp = (rawXP: number) => {
  if (rawXP === 1) {
    return 'about a year';
  }
  return `${rawXP} years`;
};

export const genIdea = (idea: string) => {
  if (idea.toLowerCase().includes('need')) {
    return 'I';
  }
  return 'I am';
};

const dropdownItems = [
  {
    name: 'Block',
    icon: NoSymbolIcon,
    alt: 'Disconnect',
    onClick: () => {},
  },
];

const connectedOnlyItems = [
  {
    name: 'Disconnect',
    icon: XCircleIcon,
    alt: 'Block',
    onClick: () => {},
  },
];

function ProfileCard({ username }: { username: string }): JSX.Element {
  // const { connected } = useConnected(username);
  const profile = useOneOneProfile(username) as MatchProfile;
  const qc = useQueryClient();
  const state = qc.getQueryState(['profile', username]);
  if (state?.status === 'loading' || state?.status !== 'success' || profile === null) {
    return <LoadingCard />;
  }
  if (profile) {
    return (
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
                        ? import.meta.env.VITE_API_URL + profile.avatar
                        : profile.avatar
                    }
                    alt=""
                  />
                </div>
              </div>
              <h2
                className="sm:ml-4 mt-4 font-sans text-2xl sm:text-3xl leading-6 font-black
                 text-neutral-900 dark:text-neutral-100"
              >
                {profile.first_name} {profile.last_name}{' '}
                <div className="inline-flex ml-1 text-neutral-600 dark:text-neutral-400 text-base">
                  {profile.pronouns ? `(${profile.pronouns})` : ''}
                </div>
                {profile.video_call_friendly && (
                  <span className="sm:mt-0 sm:mb-0 mt-5 mb-5 block">
                    <div className="-mt-4 flex-shrink-0">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md
                        text-xs font-medium bg-phthaloGreen text-honeyDew"
                      >
                        👋 Video Call Friendly
                      </span>
                    </div>
                  </span>
                )}
              </h2>
            </div>
            <div
              className="sm:ml-24 rounded-lg dark:bg-darkBG
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          className="fill-blue-400"
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762
                          0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966
                          0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75
                          1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586
                          7-2.777 7 2.476v6.759z"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:ml-20 -ml-4 space-y-2 pb-4 rounded-md pl-4 flex flex-col">
              <div className="flex flex-row space-x-2 text-sm sm:text-md font-mono">
                {profile.languages &&
                  badge(profile.languages, 'bg-darkBG font-medium text-amber-200')}
              </div>

              {/* TODO: add GITHUB */}
              <div className="flex flex-row space-x-2 text-sm sm:text-md">
                {profile.location && profile.location !== 'Other' && (
                  <div className="flex bg-darkBG text-amber-200 p-2 rounded-md">
                    🌎 {profile.location}
                  </div>
                )}
                <div className="flex bg-darkBG text-amber-200 p-2 rounded-md">
                  🕛 {profile.timezone} Time
                </div>
              </div>
            </div>
            <div
              className="sm:ml-24 rounded-lg dark:bg-darkBG
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
                        Link by {profile.first_name}{' '}
                      </a>
                    </button>
                  )}
                  <span className="block">
                    ⚡ {profile.first_name} is good at{' '}
                    {profile.dev_type &&
                      badge(
                        profile.dev_type,
                        'lg:ml-1 bg-darkBG2 text-sm font-mono font-medium text-amber-200'
                      )}{' '}
                  </span>
                  <span className="block">
                    🧲 Interested in working with {profile.preferred_dev_type} developers.
                  </span>
                  <span className="block">
                    ⚒️ Hacking stuff together for {profile.raw_xp && genExp(profile.raw_xp)} now.
                  </span>
                </div>
              </div>
            </div>
            <div
              className="sm:ml-24 rounded-lg dark:bg-darkBG
               p-4 text-neutral-800 dark:text-neutral-200
               border-[1px] border-neutral-200 dark:border-neutral-900"
            >
              <div className="flex flex-col">
                <div className="space-y-2 font-monoItalic bg-darkBG">
                  <span className="block">
                    &quot;
                    {profile.idea_status && genIdea(profile.idea_status)}{' '}
                    <span className="lowercase">{profile.idea_status}</span>
                    &quot;
                  </span>
                </div>
              </div>
            </div>
            <div
              className="sm:ml-24 rounded-lg dark:bg-darkBG
               p-4 text-neutral-800 dark:text-neutral-200
               border-[1px] border-neutral-200 dark:border-neutral-900"
            >
              <div className="flex flex-col">
                <div className="space-y-2 bg-darkBG">
                  {profile.purpose && (
                    <span className="block space-y-2">
                      <span className="flex">Why is {profile.first_name} here?</span>
                      <span className="block space-x-2 space-y-2">
                        {badge(
                          profile.purpose,
                          'bg-darkBG2 text-sm font-mono font-medium text-amber-200'
                        )}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="sm:ml-24 text-md pt-4 space-x-2 justify-start flex">
              <div className="flex flex-col">
                <button type="button" className={primaryString2}>
                  <ChatBubbleBottomCenterIcon className="lg:h-8 h-6 w-6 mr-2" aria-hidden="true" />
                  Chat
                </button>
              </div>
              <div className="flex flex-col">
                <button type="button" className={primaryString2}>
                  <VideoCameraIcon className="lg:h-8 h-6 w-6 mr-2" aria-hidden="true" />
                  Schedule
                </button>
              </div>
              <div className="flex flex-col">
                <ActionDropdown items={dropdownItems.concat(connectedOnlyItems)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
}

export default function Profile(): JSX.Element {
  const { username } = useParams<{ username: string }>() as { username: string };
  useDocumentTitle(`Profile | ${username}`);
  return <ProfileCard key={username} username={username} />;
}
