import React, { Fragment } from 'react';
import {
  ArrowUpRightIcon,
  ChatBubbleBottomCenterIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import LoadingCard from '@/components/LoadingCard';
import { primaryString2 } from '@/lib/Buttons.lib';
import { MatchProfile } from '@/lib/InterfacesStates.lib';
import { useCircleUsernames, useOneOneProfile } from '@/services/socialHooks.services';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import useAuth from '@/services/useAuth.services';
import useConnected from '@/services/useConnected.services';

function ConnectionCard({
  username,
  otherUser,
}: {
  username: string;
  otherUser: string;
}): JSX.Element {
  const connected = useConnected(username, otherUser);

  const profile = useOneOneProfile(otherUser) as MatchProfile;
  const qc = useQueryClient();
  const state = qc.getQueryState(['profile', otherUser]);
  if (state?.status === 'loading' || state?.status !== 'success' || profile === null) {
    return <LoadingCard />;
  }
  if (profile && connected) {
    return (
      <div className="justify-center flex p-0 lg:p-4">
        <div
          className="border-[1px] dark:border-neutral-900 bg-darkBG2 border-neutral-400 shadow rounded-md
         xl:w-3/4 w-full"
        >
          <div className="px-4 py-5 sm:p-6 space-y-2">
            <div className="sm:inline-flex">
              <div className="flex flex-col">
                <div className="flex-shrink-0">
                  <img
                    className="object-cover h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-linen"
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
            <div className="sm:ml-24 sm:text-lg text-sm space-x-2 flex">
              <div className="flex flex-col">
                <button type="button" className={primaryString2}>
                  <ChatBubbleBottomCenterIcon className="sm:h-8 h-6 w-6 mr-2" aria-hidden="true" />
                  <span>Chat</span>
                </button>
              </div>
              <div className="flex flex-col">
                <button type="button" className={primaryString2}>
                  <VideoCameraIcon className="sm:h-8 h-6 w-6 mr-2" aria-hidden="true" />
                  <span>Schedule</span>
                </button>
              </div>
              <div className="flex flex-col">
                <Link
                  type="button"
                  to={`/profile/${otherUser}`}
                  className="flex rounded-lg dark:bg-black
                  p-2 text-neutral-800 dark:text-neutral-200
                  border-[1px] border-neutral-200 dark:border-neutral-900"
                >
                  <ArrowUpRightIcon className="sm:h-8 h-6 w-5 mr-2" aria-hidden="true" />
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
}

export default function Circle(): JSX.Element {
  useDocumentTitle('Circle');
  const qc = useQueryClient();
  const { loggedInUser } = useAuth();
  const loggedInUserUserName = loggedInUser?.username;
  const { usernames } = useCircleUsernames(loggedInUserUserName as string);
  const state = qc.getQueryState(['circle', loggedInUserUserName as string]);
  return (
    <>
      {(state?.status === 'loading' || state?.status !== 'success' || usernames === null) && (
        <LoadingCard />
      )}
      {usernames?.map((username) => (
        <ConnectionCard
          key={username}
          username={loggedInUserUserName as string}
          otherUser={username}
        />
      ))}
    </>
  );
}
