import React from 'react';
import {
  ChatBubbleBottomCenterIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  VideoCameraIcon,
  CalendarIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import { greenString, redString, warningString, badge, primaryString2 } from '@/lib/Buttons.lib';
import {
  useCircleUsernames,
  useOneOneProfile,
  useOneOneUsernames,
  useAdded,
  useSkippedUsernames,
  useShadowedUsernames,
} from '@/services/socialHooks.services';
import { MatchProfile } from '@/lib/InterfacesStates.lib';
import LoadingCard from '@/components/LoadingCard';
import { genExp, genIdea } from '@/routes/Profile';
import useAuth from '@/services/useAuth.services';
import { PatchCircle, shadowUser, skipUser } from '@/services/profile.services';
import { Success, Error, ConfirmDialog } from '@/components/Feedback';

function MatchCard({ username }: { username: string }): JSX.Element {
  const profile = useOneOneProfile(username) as MatchProfile;
  const qc = useQueryClient();
  const state = qc.getQueryState(['profile', username]);
  // logged in username and connection check
  const { loggedInUser } = useAuth();
  const loggedInUserUserName = loggedInUser?.username;
  const added = useAdded(loggedInUserUserName as string, username);
  // logged in username and connection check
  const { usernames: skippedUsers } = useSkippedUsernames();
  const { usernames: shadowedUsers } = useShadowedUsernames();
  const { usernames: circle } = useCircleUsernames(loggedInUserUserName as string);

  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState('');
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleAdd = async () => {
    await PatchCircle(username, circle, 'add')
      .then(async () => {
        toast.custom(<Success success="Added to circle" />, {
          id: 'connect-profile-success',
          duration: 3000,
        });
        await qc.invalidateQueries(['circle', loggedInUserUserName]);
        await qc.invalidateQueries(['circle', username]);
      })
      .catch(() => {
        toast.custom(<Error error="Something went wrong." />, {
          id: 'error-connect-profile',
          duration: 5000,
        });
      });
  };

  const handleSkip = async () => {
    await skipUser(username, skippedUsers, true)
      .then(async () => {
        toast.custom(<Success success="Skipped successfully" />, {
          id: 'skip-profile-success',
          duration: 3000,
        });
        await qc.invalidateQueries(['skipped']);
        await qc.invalidateQueries(['matches']);
      })
      .catch(() => {
        toast.custom(<Error error="Something went wrong." />, {
          id: 'skip-profile-error',
          duration: 3000,
        });
      });
  };

  const handleShadow = async () => {
    await shadowUser(username, shadowedUsers, true)
      .then(async () => {
        toast.custom(<Success success="Shadowed successfully" />, {
          id: 'shadow-profile-success',
          duration: 3000,
        });
        await qc.invalidateQueries(['shadowed']);
        await qc.invalidateQueries(['matches']);
      })
      .catch(() => {
        toast.custom(<Error error="Something went wrong." />, {
          id: 'shadow-profile-error',
          duration: 3000,
        });
      });
  };

  if (state?.status === 'loading' || state?.status !== 'success' || profile === null) {
    return <LoadingCard />;
  }
  if (profile) {
    return (
      <>
        {open ? (
          <ConfirmDialog
            open={open}
            setOpen={setOpen}
            cancelButtonRef={cancelButtonRef}
            firstName={profile.first_name as string}
            action={action}
            onConfirm={() => {
              if (action === 'warn') handleSkip();
              else if (action === 'danger') handleShadow();
            }}
          />
        ) : null}
        <div className="flex justify-center p-0 lg:p-4">
          <div className="w-full rounded-md border-[1px] border-neutral-400 bg-darkBG2 shadow dark:border-neutral-800 lg:w-3/4">
            <div className="space-y-2 px-4 py-5 sm:p-6">
              <div className="sm:inline-flex">
                <div className="flex flex-col">
                  <div className="flex-shrink-0">
                    <img
                      className="h-32 w-32 rounded-full bg-linen object-cover sm:h-24 sm:w-24"
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
                  className="mt-4 font-sans text-2xl font-black leading-6 text-neutral-900 dark:text-neutral-100
                 sm:ml-4 sm:text-3xl"
                >
                  {profile.first_name} {profile.last_name}{' '}
                  <div className="ml-1 inline-flex text-base text-neutral-600 dark:text-neutral-400">
                    {profile.pronouns ? `(${profile.pronouns})` : ''}
                  </div>
                  {profile.video_call_friendly && (
                    <span className="mt-5 mb-5 block sm:mt-0 sm:mb-0">
                      <div className="-mt-4 flex-shrink-0">
                        <span
                          className="inline-flex items-center rounded-md bg-phthaloGreen px-2.5
                        py-0.5 text-xs font-medium text-honeyDew"
                        >
                          👋 Video Call Friendly
                        </span>
                      </div>
                    </span>
                  )}
                </h2>
              </div>
              <div
                className="rounded-lg border-[1px] border-neutral-200
               p-4 text-neutral-800 dark:border-neutral-800
               dark:bg-darkBG dark:text-neutral-200 sm:ml-24"
              >
                <div className="font-monoItalic">
                  <p>
                    &quot;
                    {profile.about}
                    &quot;
                  </p>
                </div>
              </div>
              <div className="-ml-4 flex flex-col space-y-4 rounded-md pt-4 pl-4 sm:ml-20">
                <div className="flex flex-row space-x-2 text-sm">
                  {profile.calendly && (
                    <div className="flex rounded-md bg-blue-800/20 p-2 text-blue-400">
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
                    <div className="flex rounded-md bg-blue-800/20 p-2 text-blue-400">
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
              <div className="-ml-4 flex flex-col space-y-2 rounded-md pb-4 pl-4 sm:ml-20">
                <div className="sm:text-md flex flex-row space-x-2 font-mono text-sm">
                  {profile.languages &&
                    badge(profile.languages, 'bg-darkBG font-medium text-amber-200')}
                </div>

                {/* TODO: add GITHUB */}
                <div className="sm:text-md flex flex-row space-x-2 text-sm">
                  {profile.location && profile.location !== 'Other' && (
                    <div className="flex rounded-md bg-darkBG p-2 text-amber-200">
                      🌎 {profile.location}
                    </div>
                  )}
                  <div className="flex rounded-md bg-darkBG p-2 text-amber-200">
                    🕛 {profile.timezone} Time
                  </div>
                </div>
              </div>
              <div
                className="rounded-lg border-[1px] border-neutral-200
               p-4 text-neutral-800 dark:border-neutral-800
               dark:bg-darkBG dark:text-neutral-200 sm:ml-24"
              >
                <div className="flex flex-col">
                  {/* TODO: add GITHUB */}
                  <div className="space-y-2 bg-darkBG">
                    {!profile.website && (
                      <button
                        type="button"
                        className="flex rounded-sm
                      bg-black p-2 text-sm"
                      >
                        <ArrowUpRightIcon className="mr-1 h-6 w-4" aria-hidden="true" />
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
                className="rounded-lg border-[1px] border-neutral-200
               p-4 text-neutral-800 dark:border-neutral-800
               dark:bg-darkBG dark:text-neutral-200 sm:ml-24"
              >
                <div className="flex flex-col">
                  <div className="space-y-2 bg-darkBG font-monoItalic">
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
                className="rounded-lg border-[1px] border-neutral-200
               p-4 text-neutral-800 dark:border-neutral-800
               dark:bg-darkBG dark:text-neutral-200 sm:ml-24"
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
              <div className="text-md flex justify-start space-x-2 pt-4 sm:ml-24">
                <div className="flex flex-col">
                  <Link to={`/messages/${username}/`} className={primaryString2}>
                    <ChatBubbleBottomCenterIcon
                      className="mr-2 h-6 w-6 lg:h-8"
                      aria-hidden="true"
                    />
                    Chat
                  </Link>
                </div>
                <div className="flex flex-col">
                  <button type="button" className={primaryString2}>
                    <VideoCameraIcon className="mr-2 h-6 w-6 lg:h-8" aria-hidden="true" />
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div key="actions" className="relative p-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-neutral-100 dark:border-neutral-800" />
          </div>
          <div className="relative hidden justify-evenly sm:hidden md:visible md:flex">
            <div className="-mt-5 flex justify-center">
              <button
                type="button"
                className={warningString}
                onClick={() => {
                  setAction('warn');
                  setOpen(true);
                }}
              >
                <ExclamationTriangleIcon className="mr-2 h-6 w-5" aria-hidden="true" />
                <span className="text-xs">Pass For 4 Weeks</span>
              </button>
            </div>
            <div className="-mt-5 flex justify-center">
              {!added ? (
                <button type="button" className={greenString} onClick={handleAdd}>
                  <PlusCircleIcon className="mr-2 h-6 w-5" aria-hidden="true" />
                  <span>Add To Circle</span>
                </button>
              ) : (
                <button type="button" className={greenString}>
                  <CheckIcon className="mr-2 h-6 w-5" aria-hidden />
                  <span>Added To Circle</span>
                </button>
              )}
            </div>
            <div className="-mt-5 flex justify-center">
              <button
                type="button"
                className={redString}
                onClick={() => {
                  setAction('danger');
                  setOpen(true);
                }}
              >
                <XMarkIcon className="mr-2 h-6 w-5" aria-hidden="true" />
                <span className="text-xs">Never Show Again</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  return <div />;
}

export default function OneOne(): JSX.Element {
  useDocumentTitle('Social Mode');
  const qc = useQueryClient();
  const { usernames } = useOneOneUsernames();

  const state = qc.getQueryState(['matches']);
  return (
    <>
      {(state?.status === 'loading' || state?.status !== 'success' || usernames === null) && (
        <LoadingCard />
      )}
      {usernames?.map((username) => (
        <MatchCard key={username} username={username} />
      ))}
      <div key="tips" className="flex justify-center p-4">
        <div className="rounded-lg shadow dark:bg-darkBG sm:w-full md:w-3/4">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="font-sans text-2xl font-black leading-6 text-neutral-900 dark:text-neutral-100">
              Prompts for Conversation/Tips
            </h2>
            <div className="text-md pt-5 text-neutral-800 dark:text-neutral-200">
              <p>
                Since you suck at making conversation and don&apos; get bitches, here are some
                prompts to spark a conversation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
