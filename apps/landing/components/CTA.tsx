import React from 'react';
import { toast } from 'react-hot-toast';
import { classNames } from '@devclad/lib';
import handleForm from '@/handleForm';

export default function CTA() {
	const [submitted, setSubmitted] = React.useState(false);
	return (
		<div className="sm:justify-center lg:flex">
			<div className="mt-10 sm:mt-12 xl:w-2/5" id="notify">
				<form
					onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
						e.preventDefault();
						const email = e.currentTarget.email.value;
						if (email && !submitted) {
							handleForm(email);
							setSubmitted(true);
						} else if (!email) {
							toast.error('Please enter a valid email address', {
								style: {
									background: '#000',
									color: '#fff',
									border: '1px dashed #555',
									width: '100%',
									fontSize: '16px',
									textAlign: 'center',
								},
								id: 'error',
								icon: '🚫',
							});
						} else {
							toast.error('Already submitted a while ago', {
								style: {
									background: '#000',
									color: '#fff',
									border: '1px dashed #555',
									width: '100%',
									fontSize: '18px',
									textAlign: 'center',
								},
								icon: '🚫',
								id: 'error-multiple',
							});
						}
					}}
					className="sm:mx-auto sm:max-w-xl lg:mx-0 lg:max-w-full"
				>
					<div className="font-mono sm:flex">
						<div className="min-w-2 flex-1">
							<label htmlFor="email">
								<span className="sr-only">Email address</span>
								<input
									id="email"
									type="email"
									placeholder="Enter your email"
									className="block w-full rounded-md border-[1px] border-neutral-800 bg-black
									px-4 py-3 text-base text-white placeholder-white focus:outline-none
									focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
								/>
							</label>
						</div>
						<div className="animate-dropglowSM mt-3 rounded-sm sm:mt-0 sm:ml-3">
							<button
								type="submit"
								className={classNames(
									submitted
										? 'border-honeyDew hover:border-phthaloGreen border-[1px] text-white focus:ring-neutral-300 focus:ring-offset-2'
										: 'border-[1px] border-neutral-600 bg-black text-white duration-1000 hover:border-neutral-400',
									'block w-full rounded-md py-3 px-3 font-medium duration-500 focus:outline-none focus:ring-2 focus:ring-offset-neutral-900'
								)}
							>
								{submitted ? 'Added to waitlist' : 'Get Notified'}
							</button>
						</div>
					</div>
					<p className="mt-5 text-center font-mono text-sm text-orange-100 sm:p-3 lg:p-2">
						50% off any future plans for the first 1000 users.
					</p>
				</form>
			</div>
		</div>
	);
}
