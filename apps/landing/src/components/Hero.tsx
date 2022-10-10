import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { checkIOS, checkMacOS } from '@devclad/lib';
import CTA from './CTA';

// network, build, and ship
function NBS(): JSX.Element {
  return (
    <div className="flex justify-center text-center">
      <div
        className="space-y-4 rounded-xl border-[1px] border-neutral-800 bg-black p-3
         shadow-2xl shadow-orange-900/20 duration-1000 hover:border-neutral-400 sm:max-w-prose"
      >
        <h2 className="animate-fadeIn space-x-4 text-4xl sm:text-6xl md:text-5xl xl:text-6xl">
          <span aria-label="Network">🤝</span>
          <span aria-label="Build">🛠️</span>
          <span aria-label="Ship">🚀</span>
        </h2>
      </div>
    </div>
  );
}

export default function Hero(): JSX.Element {
  const [isIOSMacOS, setIsIOSMacOS] = React.useState(false);

  React.useEffect(() => {
    setIsIOSMacOS(checkIOS() || checkMacOS());
  }, []);

  return (
    <div className="lg:overflow-hidden">
      <div className="mx-auto max-w-full">
        <div className="relative">
          <div className="z-10 mx-auto px-4 sm:px-6 sm:text-center lg:items-center">
            <div className="lg:py-24">
              <h1 className="mt-5 text-5xl font-black tracking-tighter text-white lg:-mt-10">
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
                className="mb-10 inline-flex items-center rounded-full border-[1px]
               border-neutral-900 bg-black p-1 pr-2 sm:text-base lg:text-sm xl:text-base"
                rel="noreferrer"
              >
                <span className="rounded-full border-[0.5px] border-neutral-500 px-4 py-0.5 font-mono text-xs font-semibold text-orange-300 lg:text-sm">
                  Beta 1.0
                </span>
                <span className="ml-4 text-xs lg:text-sm">Join our Discord</span>
                <ChevronRightIcon className="ml-2 h-5 w-5 text-neutral-500" aria-hidden="true" />
              </a>
              <div className="space-y-4">
                <div className="flex text-center sm:justify-center">
                  <div
                    className="w-full rounded-xl border-[1px] border-neutral-800 bg-black/5 p-6
                 shadow-2xl shadow-sky-500/10 md:w-3/4 lg:max-w-prose"
                  >
                    <h1 className="text-5xl text-[#fff] sm:text-6xl sm:font-medium md:text-6xl lg:text-6xl xl:text-7xl">
                      <span className="block font-bold">
                        <span className="block">Meet developers</span>
                        <span className="block rounded-xl text-orange-100">one-on-one</span>
                      </span>
                      <span className="font-bold text-fuchsia-100">Team up.</span>
                      <span className="font-bold text-sky-100"> Build.</span>
                    </h1>
                  </div>
                </div>
                {isIOSMacOS && <NBS />}
              </div>
              <CTA />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
