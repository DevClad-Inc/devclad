import React from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import classNames from '@/lib/ClassNames.lib';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import { useCircleUsernames, useConnected } from '@/services/socialHooks.services';
import useAuth from '@/services/useAuth.services';
import { badge } from '@/lib/Buttons.lib';

const activeClass = `bg-neutral-50 dark:bg-darkBG2
                    hover:text-neutral-700 dark:hover:text-orange-400
                    border-[1px] border-neutral-200 dark:border-neutral-900
                    dark:text-orange-300
                    text-orange-700`;

function MessagesNav({ user }: { user: string }): JSX.Element {
  const { pathname } = useLocation();
  const { loggedInUser } = useAuth();
  const loggedInUserUserName = loggedInUser?.username;
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
  // logged in username and connection check
  const { loggedInUser } = useAuth();
  const loggedInUserUserName = loggedInUser?.username;
  // const connected = useConnected(username, otherUser);
  // logged in username and connection check
  const { usernames: circle } = useCircleUsernames(loggedInUserUserName as string) as {
    usernames: string[];
  };
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
      <aside className="py-6 px-0 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
        <nav
          className="hidden space-y-1 rounded-md border-[1px] bg-snow
        p-4 dark:border-neutral-900 dark:bg-darkBG2 md:block"
        >
          {circle.map((user) => (
            <MessagesNav key={user} user={user} />
          ))}
          {circle.map((user) => (
            <MessagesNav key={user} user={user} />
          ))}
          {circle.map((user) => (
            <MessagesNav key={user} user={user} />
          ))}
        </nav>
      </aside>
      <Outlet />
      {/* <div className="flex items-center pb-5">
        <span className="mr-2 text-xs font-black italic font-sans">Dark Mode</span>
        <ToggleTheme />
      </div> */}
    </div>
  );
}

export function MessageChild(): JSX.Element {
  const { username } = useParams() as { username: string };
  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 rounded-md border-[1px] bg-darkBG2 py-6 px-4 dark:border-neutral-900 sm:p-6">
          <div>
            <h2 className="font-sans text-2xl leading-6  text-neutral-900 dark:text-neutral-100">
              Message {username}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function Messages(): JSX.Element {
//   return (
//     <div>
//       <h1>Messages</h1>
//       <Outlet />
//     </div>
//   );
// }
