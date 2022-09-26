import React, { Fragment, useState } from 'react';
import {
  Dialog, Transition,
} from '@headlessui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon, UserCircleIcon, UserGroupIcon, WrenchIcon, KeyIcon, VideoCameraIcon,
} from '@heroicons/react/24/outline';
import classNames from '@/lib/ClassNames.lib';

const items = [
  {
    id: 1,
    name: 'Dashboard',
    description: 'Go to Home.',
    url: '/',
    color: 'bg-indigo-500',
    icon: HomeIcon,
  },
  {
    id: 2,
    name: 'Social Mode 1-on-1',
    description: 'Social Mode. 1-on-1.',
    url: '/social',
    color: 'bg-indigo-500',
    icon: VideoCameraIcon,
  },
  {
    id: 3,
    name: 'Social Mode Circle',
    description: 'Social Mode. Circle.',
    url: '/social/circle',
    color: 'bg-indigo-500',
    icon: UserGroupIcon,
  },
  {
    id: 4,
    name: 'Account Settings',
    description: 'Settings.',
    url: '/settings',
    color: 'bg-indigo-500',
    icon: WrenchIcon,
  },
  {
    id: 5,
    name: 'Social Preferencess',
    description: 'Social Preferences',
    url: '/settings/social',
    color: 'bg-indigo-500',
    icon: UserCircleIcon,
  },
  {
    id: 6,
    name: 'Email and Password',
    description: 'Email and Password',
    url: '/settings/password',
    color: 'bg-indigo-500',
    icon: KeyIcon,
  },

];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const handleKeyPress = React.useCallback((event: React.KeyboardEvent) => {
    if ((event.key === 'Command' || 'Control') && (event.key === 'K' || event.key === 'k')) {
      setOpen(true);
    }
  }, []);
  const { pathname } = useLocation();

  // todo: fix ANYs; it's dirty
  React.useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress as any);
    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress as any);
    };
  }, [handleKeyPress]);

  return (
    <Transition.Root show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-darkBG2 bg-opacity-75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="space-y-1 text-white bg-gradient-to-br backdrop-blur-sm
            bg-black
            from-black to-orange-900/5
            border-neutral-900 border-[1px]
            mx-auto max-w-xl overflow-hidden rounded-md shadow-2xl shadow-white/20
            transition-all"
            >
              <div className="rounded-md p-4">
                <nav className="space-y-4">
                  {items.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.url}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const next = e.currentTarget.nextElementSibling;
                          if (next !== null) {
                            (next as HTMLElement).focus();
                          } else {
                            (e.currentTarget.parentElement
                              ?.firstElementChild as HTMLElement).focus();
                          }
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prev = e.currentTarget.previousElementSibling;
                          if (prev !== null) {
                            (prev as HTMLElement).focus();
                          } else {
                            (e.currentTarget.parentElement
                              ?.lastElementChild as HTMLElement).focus();
                          }
                        } else if (e.key === 'Enter') {
                          setOpen(false);
                        }
                      }}
                      className={classNames(
                        (item.url === pathname) || (`${item.url}/` === pathname)
                          ? 'animate-gradient'
                          : 'hover:animate-gradient-reverse hover:text-black',
                        'group rounded-md px-4 py-4 flex items-center text-sm',
                        'border-neutral-800 border-dashed border-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral',
                      )}
                      end
                    >
                      <item.icon
                        className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                        aria-hidden="true"
                      />
                      <span className="font-light">{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="flex flex-wrap items-center py-2.5 px-4 text-xs bg-darkBG2 text-neutral-300">
                Press
                {' '}
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-black font-semibold sm:mx-2',
                  )}
                >
                  ↓
                </kbd>
                {' '}
                or
                {' '}
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-black font-semibold sm:mx-2',
                  )}
                >
                  ↑
                </kbd>
                <span className="hidden sm:inline">to navigate,</span>
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-black font-semibold sm:mx-2',
                  )}
                >
                  ↵
                </kbd>
                {' '}
                to teleport.
              </div>
              <div className="flex flex-wrap items-center justify-end py-2.5 px-4 text-xs bg-darkBG text-neutral-300">
                <span className="hidden sm:inline">Press</span>
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-8 items-center justify-center rounded border bg-black font-semibold sm:mx-2',
                  )}
                >
                  Esc
                </kbd>
                {' '}
                to close.
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
