import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { DevCladSVG } from '@devclad/ui';
import { classNames } from '@devclad/lib';
import { Popover } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Features, Roadmap } from '@/components/Features';

function Nav(): JSX.Element {
	return (
		<Popover>
			<div className="mx-auto max-w-full px-4 sm:px-6">
				<nav
					className="relative flex items-center justify-between sm:h-10 md:justify-center"
					aria-label="DevClad Logo and Name"
				>
					<div className="z-20 flex flex-1 items-center md:absolute">
						<div className="flex w-full items-center justify-between rounded-full sm:justify-center md:w-auto">
							<Link href="/">
								<span className="sr-only">DevClad</span>
								<Image width={128} height={128} src={DevCladSVG} alt="" />
							</Link>
						</div>
					</div>
				</nav>
			</div>
		</Popover>
	);
}
function Landing(): JSX.Element {
	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});
	const { ref: roadmapRef, inView: roadmapInView } = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});

	return (
		<div className="max-h-min w-full">
			<div className="pt-6 pb-10 backdrop-blur-0 md:pb-0 lg:pb-0">
				<div
					className="hidden sm:absolute sm:inset-y-0 sm:block sm:h-screen sm:w-full"
					aria-hidden="true"
				/>
				<Nav />
				<main className="sm:h-full">
					<Hero />
				</main>
				<div
					ref={ref}
					className={classNames(inView ? 'animate-fadeIn' : '', 'mt-10 lg:-mt-10')}
				>
					<Features />
				</div>
				<div
					ref={roadmapRef}
					className={classNames(
						roadmapInView ? 'animate-fadeIn' : '',
						'mt-10 md:-mt-5 lg:-mt-10'
					)}
				>
					<Roadmap />
				</div>
				<div className="mt-5 sm:-mt-20">
					<div
						className="blob absolute h-96 w-96 rounded-full bg-gradient-to-bl from-orange-200/30
					via-fuchsia-900/30 to-sky-900/60 mix-blend-difference blur-2xl filter"
					/>
					<Contact />
				</div>

				<Footer />
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<div className="font-sansNext relative overflow-y-auto overflow-x-hidden">
			<Head>
				<title>DevClad | Social Workspace Platform for Developers ⚡️</title>
			</Head>
			<div className="relative bg-gradient-to-b from-black via-black/60 to-black">
				<Toaster />
				<div className="relative z-10">
					<Landing />
				</div>
				<div
					className="blob absolute top-10 left-1/4 h-96 w-96 rounded-full bg-gradient-to-bl from-orange-200/30
					via-fuchsia-900/10 to-sky-900/30 mix-blend-difference blur-2xl filter"
				/>
			</div>
		</div>
	);
}
