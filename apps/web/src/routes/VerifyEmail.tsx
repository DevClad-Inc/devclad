import React, { useEffect, useState } from 'react';
import { ShieldCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { DevCladSVG } from '@devclad/ui';
import { useDocumentTitle } from '@devclad/lib';
import { verifyEmail } from '@/services/auth.services';
import { Error, Success } from '@/components/Feedback';
import { useAuth } from '@/services/useAuth.services';

export function VerifyEmail(): JSX.Element {
	useDocumentTitle('Verify Email');
	const { authed } = useAuth();
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState(false);
	const { key } = useParams() as { key: string };
	useEffect(() => {
		const verification = () =>
			verifyEmail(key)
				.then((res) => {
					if (res.detail === 'ok') {
						setVerified(true);
						toast.custom(<Success success="Email verified successfully." />, {
							id: 'success-email-verification',
							duration: 3000,
						});
					} else {
						setError(true);
						toast.error('Invalid verification key.', { id: 'invalid-key-error' });
					}
				})
				.catch(() => {
					setError(true);
					toast.custom(
						<Error error="Invalid verification key OR Email already verified." />,
						{
							id: 'verify-email-error',
							duration: 5000,
						}
					);
				});
		verification();
	}, [key]);
	return (
		<div>
			<div className="relative mt-5 sm:mt-10">
				<svg
					viewBox="0 0 1090 1090"
					aria-hidden="true"
					fill="none"
					preserveAspectRatio="none"
					width="1090"
					height="1090"
					className="-z-11 absolute left-1/2 h-[788px] -translate-x-1/2 stroke-neutral-300/30
        dark:stroke-orange-800/30
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
					<h1 className="text-center text-5xl font-black text-neutral-900 dark:text-neutral-100">
						DevClad
					</h1>
				</div>
				<h2 className="mt-5 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
					Verification
				</h2>
				<p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
					<Link className=" text-orange-700 dark:text-orange-300" to="/">
						Login
					</Link>
				</p>
				<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						{verified && !error ? (
							<div className="text-center">
								<span
									className="flex w-full justify-center rounded-md border border-transparent bg-green-50 py-2 px-4
                    text-sm  text-green-800 shadow-md
                    focus:outline-none
                    focus:ring-2 focus:ring-green-200 focus:ring-offset-2"
								>
									<div className="flex">
										<div className="flex-shrink-0">
											<ShieldCheckIcon
												className="h-5 w-5 text-green-400"
												aria-hidden="true"
											/>
										</div>
										<div className="ml-2 text-base font-bold">
											<span>Email Verified successfully</span>
										</div>
									</div>
								</span>

								<Link to="/" className="items-center">
									<span
										className="dark:bg-darkBG mt-5 inline-flex justify-center
                rounded-md border border-transparent bg-orange-700 py-2
                px-4 text-sm font-bold duration-500 dark:text-orange-300"
									>
										<div className="flex">
											<div className="flex-shrink-0">
												<ArrowRightOnRectangleIcon
													className="h-5 w-5"
													aria-hidden="true"
												/>
											</div>
											<div className="ml-2 text-base font-bold">
												<span>
													{authed ? 'Go to Dashboard' : 'Click to Login'}
												</span>
											</div>
										</div>
									</span>
								</Link>
							</div>
						) : (
							<div className="text-center">
								<p className="text-center text-neutral-600 dark:text-neutral-400">
									Please wait while we verify your email.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
