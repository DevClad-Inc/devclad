import React from 'react';
import { Popover } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { toast, Toaster } from 'react-hot-toast';
import DevCladLogo from '@devclad/ui/assets/devclad.svg';
import {
  WrenchIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/solid';
import handleForm from '../handleForm';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function CTA() {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div className="sm:justify-center lg:flex">
      <div className="mt-10 sm:mt-12 xl:w-2/5" id="notify">
        <form
          onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            const email = e.currentTarget.email.value;
            if (email) {
              handleForm(email);
              setSubmitted(true);
            } else {
              toast.error('Please enter a valid email address', {
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
                icon: '🚫',
              });
            }
          }}
          className="sm:mx-auto sm:max-w-xl lg:mx-0 lg:max-w-full"
        >
          <div className="sm:flex">
            <div className="min-w-2 flex-1">
              <label htmlFor="email">
                <span className="sr-only">Email address</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="block w-full rounded-md bg-darkBG px-4 py-4
          text-base text-white placeholder-white focus:outline-none
          focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                />
              </label>
            </div>
            <div className="animate-dropdarkglow mt-3 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                className={classNames(
                  submitted
                    ? 'bg-green-300 text-black hover:bg-green-400 focus:ring-emerald-300 focus:ring-offset-2'
                    : 'bg-transparent text-white hover:bg-black',
                  'animate-darkglowbtn block w-full rounded-md py-4 px-4 font-medium duration-500 focus:outline-none focus:ring-2 focus:ring-offset-neutral-900'
                )}
              >
                {submitted ? 'You will be notified!' : 'Get Notified'}
              </button>
            </div>
          </div>
          <p className="mt-5 text-center font-mono text-sm text-orange-100 sm:p-3 lg:p-2">
            DevClad Membership ($5/mo) included for first 1000 users.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="max-h-min w-full">
      <div className="pt-6 pb-10 backdrop-blur-0 md:pb-0 lg:pb-0">
        <Toaster />
        <div
          className="hidden sm:absolute sm:inset-y-0 sm:block sm:h-screen sm:w-full"
          aria-hidden="true"
        />
        <Popover>
          <div className="mx-auto max-w-full px-4 sm:px-6">
            <nav
              className="relative flex items-center justify-between sm:h-10 md:justify-center"
              aria-label="Global"
            >
              <div className="z-20 flex flex-1 items-center md:absolute">
                <div className="mt-10 flex w-full items-center justify-between rounded-full md:w-auto">
                  <a href="/">
                    <span className="sr-only">DevClad</span>
                    <img className="h-24 w-24" src={DevCladLogo} alt="" />
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </Popover>

        <main>
          <div className="lg:overflow-hidden">
            <div className="mx-auto max-w-full">
              <div className="relative">
                <div className="z-10 mx-auto px-4 sm:px-6 sm:text-center lg:items-center">
                  <div className="lg:py-24">
                    <h1 className="text-whitewhite mt-5 text-5xl font-bold tracking-tight lg:-mt-6">
                      DevClad
                    </h1>
                    <span className="mb-2 flex sm:justify-center">
                      <h1 className="mt-1 w-fit font-mono text-xl font-bold text-orange-50">
                        <span className="flex sm:block md:block lg:block">
                          <span>Network.</span>
                          <span className="ml-2">Build.</span>
                          <span className="ml-2">Ship.</span>
                        </span>
                      </h1>
                    </span>
                    <a
                      href="https://discord.connectdome.com"
                      target="_blank"
                      className="mb-10 inline-flex items-center rounded-full bg-neutral-900 p-1 pr-2 text-white hover:text-neutral-200 sm:text-base lg:text-sm xl:text-base"
                      rel="noreferrer"
                    >
                      <span className="rounded-full bg-amber-100 px-3 py-0.5 font-mono text-xs font-semibold text-black lg:text-sm">
                        Beta 1.0 soon
                      </span>
                      <span className=" ml-4 text-xs lg:text-sm">Join our Discord</span>
                      <ChevronRightIcon
                        className="ml-2 h-5 w-5 text-neutral-500"
                        aria-hidden="true"
                      />
                    </a>
                    <div className=" flex sm:justify-center">
                      <div className="rounded-xl bg-gradient-to-br from-darkBG via-black to-neutral-900 p-6 sm:w-3/4">
                        <h1
                          className=" text-5xl font-semibold tracking-tighter
                      text-[#fff] sm:text-7xl sm:font-medium md:text-8xl xl:text-9xl"
                        >
                          <span className="block">
                            <span className="block">Meet developers</span>
                            <span className="block rounded-xl text-amber-100">one-on-one</span>
                          </span>
                          <span className="text-orange-50">Team up.</span>
                          <span className="text-orange-100"> Build.</span>
                        </h1>
                      </div>
                    </div>
                    <CTA />
                    <div className="justify-center sm:flex ">
                      <article
                        className="mt-10 rounded-xl bg-gradient-to-tr from-darkBG via-darkBG2
                      to-black p-6 text-left text-base
                     text-white sm:mt-5 sm:w-2/3 sm:text-lg lg:w-1/2 lg:text-xl xl:text-2xl"
                      >
                        <span className="flex justify-center p-2 pb-5 text-2xl font-bold uppercase text-white sm:text-2xl md:text-3xl lg:text-3xl">
                          <span>
                            What does <span className="text-amber-100 underline">DevClad</span> do?
                          </span>
                        </span>
                        <dl className="text-3xl tracking-wide">
                          <div className="absolute mt-5 flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-black">
                            <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
                          </div>
                          <dd className=" mt-3 ml-16 text-orange-50">
                            Weekly 1—&#8288;on&#8288;—&#8288;1 match from a pool of vetted
                            developers 🌎 using ML.
                          </dd>
                          <span className="mt-2 flex">
                            <div className="absolute mt-7 flex h-12 w-12 items-center justify-center rounded-md bg-amber-100 text-black">
                              <ArrowTrendingUpIcon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <dd className=" mt-2 ml-16 text-amber-50">
                              Project and Hackathon Discovery that makes teaming up{' '}
                              <span className="text-green-100">seamless</span>.
                            </dd>
                          </span>
                          <span className="mt-2 flex">
                            <div className="absolute mt-7 flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-black">
                              <WrenchIcon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <dd className="mt-2 ml-16 text-orange-50">
                              <span>
                                <span>
                                  Minimal & Robust Integrated Team Toolkit to get sh*t done faster.
                                </span>
                                <span className="block font-display text-sm font-light text-neutral-400 lg:text-lg">
                                  Stop hopping on and off full-blown platforms and focus on building
                                  your MVP with your new team instead.
                                </span>
                              </span>
                            </dd>
                          </span>
                        </dl>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className="font-quilon mt-5 sm:-mt-20">
          <div className="relative mx-auto max-w-prose rounded-xl text-center">
            <div className="max-w-prose p-2 py-16 ">
              <h2
                className="text-3xl font-extrabold tracking-tight
                      text-white sm:text-4xl"
              >
                <span className="block">About</span>
              </h2>
              <p className="mt-4 font-mono text-lg text-neutral-300">
                Built by{' '}
                <a
                  href="https://arthtyagi.xyz"
                  target="_blank"
                  className="text-orange-100 underline"
                  rel="noreferrer"
                >
                  Arth
                </a>
                , an indie developer.
              </p>
              <p className="mt-2 font-mono text-lg text-neutral-300">
                Contact me at{' '}
                <a href="mailto:arth@devclad.com" className="text-orange-100 underline">
                  arth[at]devclad.com
                </a>
              </p>
              <p className="font-mono text-lg text-neutral-300">
                Twitter{' '}
                <a
                  href="https://twitter.com/arthtyagi"
                  target="_blank"
                  className="mt-5 text-beauBlue underline"
                  rel="noreferrer"
                >
                  @arthtyagi
                </a>
                <a
                  href="https://twitter.com/devclad"
                  target="_blank"
                  className="mt-5 ml-4 text-beauBlue underline"
                  rel="noreferrer"
                >
                  @devclad
                </a>
              </p>
            </div>
          </div>
        </div>
        <span>
          <div className="flex justify-center">
            <div className="flex flex-col justify-center">
              <button
                type="button"
                className="-mb-5 flex justify-center sm:mb-5"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ArrowUpIcon className="h-6 w-6 animate-bounce text-white" />
              </button>
            </div>
          </div>
        </span>
      </div>
    </div>
  );
}
