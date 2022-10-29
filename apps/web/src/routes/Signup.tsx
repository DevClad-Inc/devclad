import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DevCladSVG } from '@devclad/ui';
import { Error } from '@/components/Feedback';
import SignupForm from '@/components/forms/Signup.forms';
import { useAuth } from '@/services/useAuth.services';

export function Signup() {
	const [signupError, setSignupError] = useState('');
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { authed } = useAuth();

	if (authed) {
		if (pathname.includes('signup')) {
			navigate('/');
		} else {
			navigate(pathname);
		}
	}

	return (
		<>
			<div className="relative mt-5 sm:mt-10">
				<svg
					viewBox="0 0 1090 1090"
					aria-hidden="true"
					fill="none"
					preserveAspectRatio="none"
					width="1090"
					height="1090"
					className="-z-11 absolute left-1/2 h-[788px] -translate-x-1/2 stroke-neutral-300/30
          dark:stroke-orange-800/20
          sm:-top-24 sm:h-auto"
				>
					<circle cx="545" cy="545" r="544.5" />
					<circle cx="545" cy="545" r="512.5" />
					<circle cx="545" cy="545" r="480.5" />
					<circle cx="545" cy="545" r="448.5" />
					<circle cx="545" cy="545" r="416.5" />
					<circle cx="545" cy="545" r="384.5" />
					<circle cx="545" cy="545" r="352.5" />
				</svg>
			</div>
			<div className="backdrop-blur-0">
				<div className="sm:mx-auto sm:w-full sm:max-w-full">
					<img className="mx-auto h-32 w-auto" src={DevCladSVG} alt="DevClad" />
					<h1 className="text-center text-5xl font-black text-neutral-900 dark:text-white">
						DevClad
					</h1>
				</div>
				<h2 className="mt-5 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
					Request to Join
				</h2>
				<p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
					Already a member?{' '}
					<Link className=" text-orange-700 dark:text-orange-300" to="/">
						Sign in to DevClad
					</Link>
				</p>
				<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						{signupError && <Error error={signupError} />}
						<div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
							<SignupForm
								signupErrorState={signupError}
								setSignupErrorState={setSignupError}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
