import { ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function Contact(): JSX.Element {
  return (
    <div className="relative mx-auto max-w-prose rounded-xl text-center sm:py-24">
      <div className="max-w-prose p-2 py-16 ">
        <h2 className="text-3xl font-extrabold  text-white sm:text-4xl">
          <span className="block">Reach out</span>
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
            <span className="ml-4 text-xs font-medium lg:text-sm">Join our Discord</span>
            <ChevronRightIcon className="ml-2 h-5 w-5 text-neutral-500" aria-hidden="true" />
          </a>
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
