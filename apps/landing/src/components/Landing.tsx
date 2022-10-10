import React, { useCallback } from 'react';
import { Popover } from '@headlessui/react';
import { classNames } from '@devclad/lib';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import type { Container, Engine, MoveDirection, OutMode } from 'tsparticles-engine';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { DevCladSVG } from '@devclad/ui';
import Hero from './Hero';
import Contact from './Contact';
import { Features, Roadmap } from './Features';

function StarrySky() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await container?.refresh();
  }, []);
  return (
    <div className="absolute inset-0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        // https://github.com/matteobruni/tsparticles/blob/main/presets/stars/src/options.ts
        options={{
          particles: {
            move: {
              direction: 'none' as MoveDirection,
              enable: true,
              outModes: {
                default: 'out' as OutMode,
              },
              random: true,
              speed: 0.1,
              straight: false,
            },
            opacity: {
              animation: {
                enable: true,
                speed: 0.1,
                sync: false,
              },
              value: { min: 0, max: 0.15 },
            },
            size: {
              value: { min: 0.5, max: 5 },
              // number of particles
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}

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

function Footer(): JSX.Element {
  return (
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
  );
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
                <img className="h-24 w-24" src={DevCladSVG} alt="" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </Popover>
  );
}

export default function Landing() {
  const featureRef = React.useRef<HTMLDivElement>(null);
  const roadmapRef = React.useRef<HTMLDivElement>(null);
  const contactRef = React.useRef<HTMLDivElement>(null);
  const { inView: featureInView } = useELInView({ viewRef: featureRef });
  const { inView: roadMapInView } = useELInView({ viewRef: roadmapRef });
  const { inView: contactInView } = useELInView({ viewRef: contactRef });
  return (
    <div className="max-h-min w-full">
      <StarrySky />
      <div className="pt-6 pb-10 backdrop-blur-0 md:pb-0 lg:pb-0">
        <div
          className="hidden sm:absolute sm:inset-y-0 sm:block sm:h-screen sm:w-full"
          aria-hidden="true"
        />
        <Nav />
        <main className="sm:h-screen">
          <Hero />
        </main>
        <div
          ref={featureRef}
          className={classNames(featureInView ? 'animate-fadeIn' : '', 'mt-10 md:-mt-16 lg:-mt-10')}
        >
          <Features />
        </div>
        <div
          ref={roadmapRef}
          className={classNames(roadMapInView ? 'animate-fadeIn' : '', 'mt-10 md:-mt-16 lg:-mt-10')}
        >
          <Roadmap />
        </div>
        <div
          ref={contactRef}
          className={classNames(contactInView ? 'animate-fadeIn' : '', 'mt-5 sm:-mt-20')}
        >
          <Contact />
        </div>
        <Footer />
      </div>
    </div>
  );
}
