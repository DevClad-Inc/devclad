import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserCircleIcon,
  UserGroupIcon,
  WrenchIcon,
  KeyIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
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
    name: 'Messages Dashboard',
    description: 'Messages Dashboard',
    url: '/messages',
    color: 'bg-indigo-500',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    id: 3,
    name: 'Social Mode 1-on-1',
    description: 'Social Mode. 1-on-1.',
    url: '/social',
    color: 'bg-indigo-500',
    icon: VideoCameraIcon,
  },
  {
    id: 4,
    name: 'Social Mode Circle',
    description: 'Social Mode. Circle.',
    url: '/social/circle',
    color: 'bg-indigo-500',
    icon: UserGroupIcon,
  },
  {
    id: 5,
    name: 'Account Settings',
    description: 'Settings.',
    url: '/settings',
    color: 'bg-indigo-500',
    icon: WrenchIcon,
  },
  {
    id: 6,
    name: 'Social Preferencess',
    description: 'Social Preferences',
    url: '/settings/social',
    color: 'bg-indigo-500',
    icon: UserCircleIcon,
  },
  {
    id: 7,
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
    const target = event.target as HTMLInputElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    if ((event.key === 'Command' || 'Control') && (event.key === 'K' || event.key === 'k')) {
      setOpen(true);
    }
  }, []);
  const { pathname } = useLocation();

  // todo: fix ANYs; it's dirty
  React.useEffect(() => {
    // attach the event listener
    // check if the user is on a form field
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
          <div className="fixed inset-0 bg-darkBG2 bg-opacity-90 backdrop-blur-sm transition-opacity" />
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
            <Dialog.Panel
              className="mx-auto max-w-xl space-y-1 overflow-hidden
            rounded-md
            border-[1px] border-neutral-800
            bg-black bg-gradient-to-br
            from-black to-orange-900/5 text-white shadow-2xl shadow-white/20 backdrop-blur-sm
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
                            (
                              e.currentTarget.parentElement?.firstElementChild as HTMLElement
                            ).focus();
                          }
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prev = e.currentTarget.previousElementSibling;
                          if (prev !== null) {
                            (prev as HTMLElement).focus();
                          } else {
                            (
                              e.currentTarget.parentElement?.lastElementChild as HTMLElement
                            ).focus();
                          }
                        } else if (e.key === 'Enter') {
                          setOpen(false);
                        }
                      }}
                      className={classNames(
                        item.url === pathname || `${item.url}/` === pathname
                          ? 'animate-gradient'
                          : 'hover:animate-gradient-reverse hover:text-black',
                        'group flex items-center rounded-md px-4 py-4 text-sm',
                        'focus:ring-offset-neutral border-[1px] border-dashed border-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2'
                      )}
                      end
                    >
                      <item.icon className="-ml-1 mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" />
                      <span className="font-light">{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="flex flex-wrap items-center bg-darkBG2 py-2.5 px-4 text-xs text-neutral-300">
                Press{' '}
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-black font-semibold sm:mx-2'
                  )}
                >
                  ↓
                </kbd>{' '}
                or{' '}
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-black font-semibold sm:mx-2'
                  )}
                >
                  ↑
                </kbd>
                <span className="hidden sm:inline">to navigate,</span>
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-black font-semibold sm:mx-2'
                  )}
                >
                  ↵
                </kbd>{' '}
                to teleport.
              </div>
              <div className="flex flex-wrap items-center justify-end bg-darkBG py-2.5 px-4 text-xs text-neutral-300">
                <span className="hidden sm:inline">Press</span>
                <kbd
                  className={classNames(
                    'mx-1 flex h-5 w-8 items-center justify-center rounded border bg-black font-semibold sm:mx-2'
                  )}
                >
                  Esc
                </kbd>{' '}
                to close.
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
