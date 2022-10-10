import React from 'react';

// function Features(): JSX.Element {
//   return <div />;
// }
export default function Contact(): JSX.Element {
  return (
    <div className="relative mx-auto max-w-prose rounded-xl text-center">
      <div className="max-w-prose p-2 py-16 ">
        <h2
          className="text-3xl font-extrabold tracking-tight
                      text-white sm:text-4xl"
        >
          <span className="block">Reach out</span>
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
