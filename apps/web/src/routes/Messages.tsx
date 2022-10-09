import React from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { PaperClipIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { classNames, useDocumentTitle } from '@devclad/lib';
import {
  useCircleUsernames,
  useConnected,
  useProfile,
  useStreamUID,
} from '@/services/socialHooks.services';
import { useAuth } from '@/services/useAuth.services';
import { badge } from '@/lib/Buttons.lib';
import { Profile } from '@/lib/InterfacesStates.lib';
import { MessagesLoading } from '@/components/LoadingStates';
import { Error } from '@/components/Feedback';

const activeClass = `bg-neutral-50 dark:bg-darkBG2
                    hover:text-neutral-700 dark:hover:text-orange-400
                    border-[1px] border-neutral-200 dark:border-neutral-800
                    dark:text-orange-300
                    text-orange-700`;

function MessagesNav({ user }: { user: string }): JSX.Element {
  const { pathname } = useLocation();
  const { loggedInUser } = useAuth();
  const loggedInUserUserName = loggedInUser.username;
  const connected = useConnected(user, loggedInUserUserName as string);

  if (connected) {
    return (
      <NavLink
        key={user}
        to={`/messages/${user}/`}
        className={classNames(
          `/messages/${user}/` === pathname
            ? activeClass
            : 'text-neutral-900 hover:bg-white hover:text-neutral-900 dark:text-neutral-100 dark:hover:bg-darkBG dark:hover:text-white',
          'group flex items-center rounded-md px-3 py-2 text-sm'
        )}
        aria-current={pathname === user ? 'page' : undefined}
      >
        {/* <item.icon className="-ml-1 mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" /> */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="truncate">{user}</span>
            <div>
              <span>{badge('3 unread', 'bg-darkBG')}</span>
              <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-600">1h ago</span>
            </div>
          </div>
        </div>
      </NavLink>
    );
  }
  return <div />;
}

export default function Messages() {
  useDocumentTitle('Messages');
  const { loggedInUser } = useAuth();
  const loggedInUserUserName = loggedInUser.username;
  const { usernames: circle } = useCircleUsernames(loggedInUserUserName as string) as {
    usernames: string[];
  };
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
      <aside className="py-0 px-0 sm:py-6 sm:px-6 lg:col-span-4 lg:py-0 lg:px-0">
        <nav
          className="scrollbar hidden space-y-2 overflow-auto rounded-md border-[1px] p-4
        dark:border-neutral-800 dark:bg-darkBG2 md:block lg:max-h-[77vh]"
        >
          {circle.map((user) => (
            <MessagesNav key={user} user={user} />
          ))}
        </nav>
      </aside>
      <Outlet />
    </div>
  );
}

export function MessageChild(): JSX.Element {
  const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
  // UID of the other user
  const { username } = useParams() as { username: string };
  const otherUserUID = useStreamUID(username);
  // UID of logged in user
  const { loggedInUser, streamToken } = useAuth();
  const loggedInUserUserName = loggedInUser.username as string;
  const currUserUID = useStreamUID(loggedInUserUserName);

  const profileData = useProfile(loggedInUserUserName as string) as Profile;
  // const otherProfile = useProfile(username) as Profile;

  const qc = useQueryClient();
  const state = qc.getQueryState(['profile', loggedInUserUserName as string]);

  React.useEffect(() => {
    if (
      streamToken !== null &&
      loggedInUser !== null &&
      currUserUID !== null &&
      otherUserUID !== null &&
      profileData !== null
      // && Cookies.get('streamConnected') !== 'true'
    ) {
      const ConnectandCreateChannel = async () => {
        await client
          .connectUser(
            {
              id: streamToken?.uid as string,
              first_name: loggedInUser.first_name as string,
              last_name: loggedInUser.last_name as string,
              username: loggedInUser.username,
              email: loggedInUser.email,
              image: profileData.avatar as string,
            },
            streamToken?.token as string
          )
          .then(async () => {
            Cookies.set('streamConnected', 'true');
            const channel = client.channel('messaging', { members: [currUserUID, otherUserUID] });
            await channel
              .create()
              .then(async () => {
                // console.log(resp);
                // await channel.watch();
              })
              .catch(() => {
                toast.custom(<Error error="Error initiating chat." />, {
                  id: 'error-channel-create',
                });
              });
          })
          .catch(() => {
            toast.custom(<Error error="Cannot connect to Stream. Try refreshing the page." />, {
              id: 'stream-connect-error',
            });
          });
      };
      ConnectandCreateChannel();
    }
  }, [client, currUserUID, loggedInUser, otherUserUID, profileData, streamToken]);

  if (state?.status === 'loading' || state?.status !== 'success' || profileData === null) {
    return <MessagesLoading />;
  }
  return (
    <div className="space-y-6 sm:px-6 lg:col-span-8 lg:px-0">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="h-[60vh] space-y-6 rounded-md border-[1px] bg-darkBG2 py-6 px-4 dark:border-neutral-800 sm:p-6">
          <div className="flex h-full flex-col">
            <div className="scrollbar flex-1 overflow-y-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-row items-center space-x-2">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-row">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          <span className="text-orange-400">@</span>
                          <span className="text-orange-400">username</span>
                        </div>
                        <div className="text-xs text-neutral-400 dark:text-neutral-600">
                          <span>1h ago</span>
                        </div>
                      </div>
                      <div className="mt-2 max-w-sm rounded-xl bg-neutral-900 p-3 text-sm text-neutral-100">
                        <span>
                          Message Message Message Message Message Message Message Message Message
                          Message
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse items-center space-x-2">
                    <div className="ml-2 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-row-reverse">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          <span className="text-orange-400">@</span>
                          <span className="text-orange-400">username</span>
                        </div>
                        <div className="text-xs text-neutral-400 dark:text-neutral-600">
                          <span>1h ago</span>
                        </div>
                      </div>
                      <div className="mt-2 max-w-sm rounded-xl bg-neutral-800 p-3 text-sm text-white">
                        <span>Message</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start sm:space-x-4">
        <div className="flex-shrink-0">
          <img
            className="hidden h-10 w-10 rounded-full bg-linen object-cover sm:inline-block"
            src={
              import.meta.env.VITE_DEVELOPMENT
                ? import.meta.env.VITE_API_URL + profileData.avatar
                : profileData.avatar
            }
            alt=""
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative">
            <div className="overflow-hidden rounded-lg border-[1px] border-neutral-800 bg-darkBG2 shadow-sm placeholder:text-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm">
              <textarea
                rows={2}
                name="comment"
                id="comment"
                className="block w-full resize-none bg-darkBG p-2 py-3 placeholder:text-gray-500 focus:outline-none sm:text-sm"
                placeholder={`Message ${username}`}
                defaultValue=""
              />

              <div className="py-1" aria-hidden="true">
                <div className="py-px">
                  <div className="h-9" />
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
              <div className="flex items-center space-x-5">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                  >
                    <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Attach a file</span>
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border-[1px] border-neutral-800 bg-darkBG2 px-6
                   py-1 text-sm hover:bg-darkBG focus:outline-none focus:ring-2 focus:ring-neutral-600"
                >
                  Send
                  <PaperAirplaneIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
