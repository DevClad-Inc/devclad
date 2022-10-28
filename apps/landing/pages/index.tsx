import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { DevCladSVG, GraphTextureSVG } from '@devclad/ui';
import { classNames } from '@devclad/lib';
import { Popover } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Features, Roadmap } from '@/components/Features';

function useELInView({ viewRef }: { viewRef: React.RefObject<HTMLElement> }) {
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
}

function Nav(): JSX.Element {
	return (
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
								<Image className="h-24 w-24" src={DevCladSVG} alt="" />
							</a>
						</div>
					</div>
				</nav>
			</div>
		</Popover>
	);
}

function Landing(): JSX.Element {
	const featureRef = React.useRef<HTMLDivElement>(null);
	const roadmapRef = React.useRef<HTMLDivElement>(null);
	const contactRef = React.useRef<HTMLDivElement>(null);
	const { inView: featureInView, viewed: featureViewed } = useELInView({ viewRef: featureRef });
	const { inView: roadMapInView, viewed: roadMapViewed } = useELInView({ viewRef: roadmapRef });
	const { inView: contactInView, viewed: contactViewed } = useELInView({ viewRef: contactRef });
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
					ref={featureRef}
					className={classNames(
						featureInView && featureViewed < 2 ? 'animate-fadeIn' : '',
						'mt-10 lg:-mt-10'
					)}
				>
					<Features />
				</div>
				<div
					ref={roadmapRef}
					className={classNames(
						roadMapInView && roadMapViewed < 2 ? 'animate-fadeIn' : '',
						'mt-10 md:-mt-5 lg:-mt-10'
					)}
				>
					<Roadmap />
				</div>
				<div
					ref={contactRef}
					className={classNames(
						contactInView && contactViewed < 2 ? 'animate-fadeIn' : '',
						'mt-5 sm:-mt-20'
					)}
				>
					<Contact />
				</div>
				<Footer />
			</div>
		</div>
	);
}

export default function Home() {
	const title = 'DevClad - Network, Build, and Ship rapidly';
	const desc =
		'Social Workspace Platform built for developers. Meet developers 1:1 using AI, build your network, and ship the next best thing.';
	return (
		<div
			className="relative overflow-y-auto overflow-x-hidden"
			style={{
				backgroundImage: `url(${GraphTextureSVG})`,
			}}
		>
			<Head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content={desc} />
				<link rel="icon" type="image/svg+xml" href="/favicon.ico" />
				<meta name="theme-color" content="#101218" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="canonical" href="https://devclad.com/" />
				<meta name="title" content="DevClad - Social Workspace Platform for Developers" />

				{/* <!-- Open Graph / Facebook --> */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://devclad.coc}m/" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={desc} />
				<meta
					property="og:image"
					content="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/677a1e0a-bd95-4e85-7aa3-86287a865f00/public"
				/>

				{/* <!-- Twitter --> */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://devclad.com/" />
				<meta property="twitter:title" content={title} />
				<meta property="twitter:description" content={desc} />
				<meta
					property="twitter:image"
					content="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/677a1e0a-bd95-4e85-7aa3-86287a865f00/public"
				/>
				<title>DevClad | Social Workspace Platform for Developers ⚡️</title>
			</Head>
			<div className="relative bg-gradient-to-b from-black via-black/60 to-black">
				<Toaster />
				<div
					className="absolute top-10 -left-2 h-48 w-48 rounded-full bg-sky-900/60
	 opacity-50 mix-blend-difference blur-2xl filter"
				/>
				<div
					className="animate-blob absolute top-20 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-orange-900
	  via-fuchsia-900/10 to-black opacity-50 mix-blend-difference blur-2xl filter"
				/>
				<div className="relative z-10">
					<Landing />
				</div>
				<div
					className="blob absolute bottom-5 left-1/3 h-96 w-96 rounded-full bg-gradient-to-bl from-sky-900/90
	 via-fuchsia-900/10 to-black opacity-80 mix-blend-difference blur-2xl filter"
				/>
				<div className="animate-blob absolute bottom-1/2 right-2 h-96 w-96 rounded-full bg-sky-900/30 opacity-50 mix-blend-difference blur-2xl filter" />
				<div className="animate-dropglow animate-blob absolute bottom-1/2 right-2 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-900/30 via-fuchsia-900/30 to-black opacity-50 mix-blend-difference blur-2xl filter" />
			</div>
		</div>
	);
}
