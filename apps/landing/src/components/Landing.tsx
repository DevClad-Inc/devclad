import React from 'react';
import { Popover } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import DevCladLogo from '@devclad/ui/assets/devclad.svg';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import CTA from './CTA';

// todo: add this to shared package
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const useELInView = (viewRef: React.RefObject<HTMLElement>) => {
  const [inView, setInView] = React.useState(false);
  const [viewed, setViewed] = React.useState(0);
  const observer = React.useRef<IntersectionObserver>();

  React.useEffect(() => {
    observer.current = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && viewRef.current) {
        setViewed((prev) => prev + 1);
      }
    });
    const { current: currentObserver } = observer;
    if (viewRef.current) {
      currentObserver.observe(viewRef.current);
    }
    return () => {
      currentObserver.disconnect();
    };
  }, [setViewed, viewRef]);
  return { inView, viewed };
};

function Hero(): JSX.Element {
  return (
    <div className="lg:overflow-hidden">
      <div className="mx-auto max-w-full">
        <div className="relative">
          <div className="z-10 mx-auto px-4 sm:px-6 sm:text-center lg:items-center">
            <div className="lg:py-24">
              <h1 className="mt-5 text-5xl font-black tracking-tighter text-white lg:-mt-6">
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
                className="mb-10 inline-flex animate-darkglowbtn items-center
               rounded-full bg-black p-1 pr-2 sm:text-base lg:text-sm xl:text-base"
                rel="noreferrer"
              >
                <span className="rounded-full bg-neutral-900 px-3 py-0.5 font-mono text-xs font-semibold lg:text-sm">
                  Beta 1.0 soon
                </span>
                <span className="mb-auto inline-flex h-2 w-2 rounded-full bg-orange-400">
                  <span className="h-2 w-2 animate-ping rounded-full bg-orange-300" />
                </span>
                <span className=" ml-4 text-xs lg:text-sm">Join our Discord</span>
                <ChevronRightIcon className="ml-2 h-5 w-5 text-neutral-500" aria-hidden="true" />
              </a>
              <div className="flex sm:justify-center">
                <div className="fade-in rounded-xl border-[1px] border-neutral-800 bg-black p-6 shadow-2xl shadow-fuchsia-900/30 sm:w-3/4">
                  <h1 className=" text-5xl  text-[#fff] sm:text-7xl sm:font-medium md:text-8xl xl:text-9xl">
                    <span className="block font-bold">
                      <span className="block">Meet developers</span>
                      <span className="block rounded-xl text-amber-100">one-on-one</span>
                    </span>
                    <span className="font-bold">Team up.</span>
                    <span className="font-bold"> Build.</span>
                  </h1>
                </div>
              </div>
              <CTA />
              <div className="justify-center sm:flex " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// function Features(): JSX.Element {
//   return <div />;
// }

// function Footer(): JSX.Element {
//   return <div />;
// }

function Contact(): JSX.Element {
  return (
    <div className="relative mx-auto max-w-prose rounded-xl text-center">
      <div className="max-w-prose p-2 py-16 ">
        <h2
          className="text-3xl font-extrabold tracking-tight
                      text-white sm:text-4xl"
        >
          <span className="block">Reach out to Me</span>
        </h2>
        <p className="mt-2 font-mono text-lg text-neutral-300">
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
  );
}

export default function Landing() {
  const contactRef = React.useRef<HTMLDivElement>(null);
  const { inView, viewed } = useELInView(contactRef);
  return (
    <div className="max-h-min w-full">
      <div className="pt-6 pb-10 backdrop-blur-0 md:pb-0 lg:pb-0">
        <div
          className="hidden sm:absolute sm:inset-y-0 sm:block sm:h-screen sm:w-full"
          aria-hidden="true"
        />
        <Popover>
          <div className="mx-auto max-w-full px-4 sm:px-6">
            <nav
              className="relative flex items-center justify-between sm:h-10 md:justify-center"
              aria-label="DevClad Logo and Name"
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
          <Hero />
        </main>
        <div
          ref={contactRef}
          className={classNames(inView && viewed < 2 ? 'animate-fadeIn' : '', 'mt-5 sm:-mt-20')}
        >
          <Contact />
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
