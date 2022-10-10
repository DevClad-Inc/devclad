import React from 'react';
import {
  HandRaisedIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ArrowTrendingUpIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@devclad/lib';

const features = [
  {
    name: '1 on 1 Matches',
    description:
      'Every week, you are matched with another dev using an ML algorithm for a 1 on 1 call.',
    icon: HandRaisedIcon,
  },
  {
    name: 'Circle of Developers',
    description: 'Easily manage the circle of developers you like and want to work with. 🤝 ',
    icon: UserGroupIcon,
  },
  {
    name: 'Video Calls + Scheduling',
    description:
      'Schedule meetings with your circle and weekly 1-on-1 directly from and even ON DevClad. 📅',
    icon: VideoCameraIcon,
  },
];

const roadmap = [
  {
    name: 'Discovery',
    description: 'Project and Hackathon Discovery that makes teaming up seamless.',
    icon: ArrowTrendingUpIcon,
  },
  {
    name: 'Minimal Teams',
    description: 'Minimal & Robust Integrated Team Toolkit to get sh*t done faster.',
    icon: WrenchIcon,
  },
];

export function Features(): JSX.Element {
  return (
    <div className="animate-fadeIn space-y-16 py-4 sm:py-8">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-lg font-semibold text-neutral-300">Meet developers</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
          Build a <span className="font-black text-orange-500">strong</span> network of developers.
        </p>
        <p className="mx-auto mt-5 max-w-prose font-mono text-xl text-neutral-300">
          Weekly 1—⁠on⁠—⁠1 match from a pool of vetted developers 🌎 using ML.
        </p>
        <div className="mt-12 flex">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root h-full rounded-xl border-[1px] border-neutral-800 bg-black px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span
                        className="inline-flex animate-dropglow items-center justify-center
                       rounded-xl border-[1px] border-neutral-800 bg-black p-4 shadow-lg"
                      >
                        <feature.icon
                          className={classNames(
                            feature.icon === HandRaisedIcon ? '-rotate-[30deg]' : '',
                            'h-8 w-8'
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 font-bold tracking-tight text-neutral-100 sm:text-xl lg:text-2xl">
                      {feature.name}
                    </h3>
                    <p className="mt-5 font-mono text-neutral-300 sm:text-sm lg:text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Roadmap(): JSX.Element {
  return (
    <div className="animate-fadeIn space-y-16 py-4 sm:py-32">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-lg font-semibold text-neutral-300">Down the roadmap for Beta 2.0</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
          <span className="font-black text-fuchsia-500">Team up</span> on Projects and Hackathons
        </p>
        <p className="mx-auto mt-5 max-w-prose font-mono text-xl text-neutral-300">
          Spend less time configuring your workspace and more time building with minimal interfaces
          that get you to your MVP faster.
        </p>
        <div className="mt-12 flex justify-center">
          <div className="grid max-w-prose grid-cols-1 gap-8 sm:grid-cols-2">
            {roadmap.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root h-full rounded-xl border-[1px] border-neutral-800 bg-black px-6 pb-8 ">
                  <div className="-mt-6">
                    <div>
                      <span
                        className="inline-flex animate-dropglowSM items-center justify-center
                   rounded-xl border-[1px] border-dotted border-neutral-800 bg-darkBG2 p-4 shadow-lg"
                      >
                        <feature.icon
                          className={classNames(
                            feature.icon === HandRaisedIcon ? '-rotate-[30deg]' : '',
                            'h-8 w-8 animate-gradient-reverse'
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 font-bold tracking-tight text-neutral-100 sm:text-xl lg:text-2xl">
                      {feature.name}
                    </h3>
                    <p className="mt-5 font-mono text-neutral-300 sm:text-sm lg:text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
