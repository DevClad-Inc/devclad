import React from 'react';
import Image from 'next/image';
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
		<div className="space-y-16 py-4 sm:animate-none sm:py-8">
			<div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<svg
					className="absolute left-full hidden -translate-x-1/2 -translate-y-1/4 transform lg:block"
					width={404}
					height={784}
					fill="none"
					viewBox="0 0 404 784"
					aria-hidden="true"
				>
					<defs>
						<pattern
							id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
							x={0}
							y={0}
							width={20}
							height={20}
							patternUnits="userSpaceOnUse"
						>
							<rect
								x={0}
								y={0}
								width={4}
								height={4}
								className="text-neutral-900"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width={404}
						height={784}
						fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"
					/>
				</svg>

				<div className="relative">
					<h2 className="text-center text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
						<span className="font-black text-orange-300">First</span> social-workspace
						platform for <span className="font-black text-orange-300">developers</span>
					</h2>
					<p className=" mx-auto mt-4 max-w-3xl text-center font-sans text-lg text-neutral-200">
						🌱 DevClad is built on the principles of collaboration over consumption and
						reducing friction for developers outside of tech-hubs. Think of this as a
						Silicon Valley emulation constituting of other{' '}
						<span className="font-black">builders who love to build ❤️</span>
					</p>
				</div>

				<div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
					<div className="relative">
						<h3 className="text-center text-3xl font-bold tracking-tight sm:text-3xl">
							Build a <span className="font-black text-orange-500">strong</span>{' '}
							network of developers.
						</h3>
						<p className="mt-3 text-center font-mono text-lg tracking-tight text-neutral-200">
							Weekly 1—⁠on⁠—⁠1 match from a pool of vetted developers 🌎 using ML.
						</p>
						<span className="text-sm italic text-neutral-400">
							“More you build with others, the more likely you are to end up building
							the next unicorn.”{' '}
							<span className="text-white">— Probably someone</span>
						</span>

						<dl className="mt-10 space-y-10">
							{features.map((feature) => (
								<div key={feature.name} className="pt-6">
									<div className="flow-root h-full rounded-xl border-[1px] border-neutral-800 bg-black px-6 pb-8">
										<div className="-mt-6">
											<div>
												<span
													className="inline-flex items-center justify-center rounded-2xl
                       border-[1px] border-dotted border-orange-200 bg-black p-4 shadow-lg"
												>
													<feature.icon
														className={classNames(
															feature.icon === HandRaisedIcon
																? '-rotate-[30deg]'
																: '',
															'h-8 w-8 stroke-orange-200 stroke-2'
														)}
														aria-hidden="true"
													/>
												</span>
											</div>
											<h3 className="mx-20 -mt-5 font-bold tracking-tight text-neutral-100 sm:text-xl lg:text-2xl">
												{feature.name}
											</h3>
											<p className="mt-5 font-mono text-neutral-300 sm:text-sm lg:text-lg">
												{feature.description}
											</p>
										</div>
									</div>
								</div>
							))}
						</dl>
					</div>

					<div className="relative -mx-4 mt-10 lg:mt-0" aria-hidden="true">
						<div className="space-y-4">
							<Image
								className="rounded-xl bg-black shadow-2xl shadow-white/10"
								src="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/2af90755-5cb2-4ed0-6192-b34660e3f200/public"
								alt="1-on-1 Match"
								width={2000}
								height={2000}
								blurDataURL="data:..."
								placeholder="blur" // Optional blur-up while loading
							/>
							<Image
								className="rounded-xl bg-black shadow-2xl shadow-white/10"
								src="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/bb558a00-7647-464b-e168-438fc8d74800/public"
								alt="1-on-1 Match"
								width={2000}
								height={2000}
								blurDataURL="data:..."
								placeholder="blur" // Optional blur-up while loading
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function Roadmap(): JSX.Element {
	return (
		<div className="animate-fadeIn space-y-16 py-4 sm:py-32">
			<svg
				className="absolute right-full hidden translate-x-1/2 translate-y-12 transform lg:block"
				width={404}
				height={784}
				fill="none"
				viewBox="0 0 404 784"
				aria-hidden="true"
			>
				<defs>
					<pattern
						id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
						x={0}
						y={0}
						width={20}
						height={20}
						patternUnits="userSpaceOnUse"
					>
						<rect
							x={0}
							y={0}
							width={4}
							height={4}
							className="text-neutral-900"
							fill="currentColor"
						/>
					</pattern>
				</defs>
				<rect width={404} height={784} fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
			</svg>
			<div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
				<h2 className="text-lg font-semibold text-neutral-300">
					Down the roadmap for Beta 2.0
				</h2>
				<p className="mt-2 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
					<span className="font-black text-fuchsia-400">Team up</span> on Projects and
					Hackathons
				</p>
				<p className="mx-auto mt-5 max-w-prose font-mono text-xl text-neutral-300">
					Spend less time configuring your workspace and more time building with minimal
					interfaces that get you to your MVP faster.
				</p>

				<div className="mt-12 flex justify-center">
					<div className="grid max-w-prose grid-cols-1 gap-8 sm:grid-cols-2">
						{roadmap.map((feature) => (
							<div key={feature.name} className="pt-6">
								<div className="flow-root h-full rounded-xl border-[1px] border-neutral-800 bg-black px-6 pb-8 ">
									<div className="-mt-6">
										<div>
											<span
												className=" bg-darkBG2 inline-flex items-center
                   justify-center rounded-full border-[1px] border-dotted border-fuchsia-200 p-4 shadow-lg"
											>
												<feature.icon
													className="h-8 w-8 stroke-fuchsia-100 stroke-2"
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
