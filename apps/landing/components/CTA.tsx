import React from 'react';

export default function CTA() {
	return (
		<div className="sm:justify-center lg:flex">
			<div className="mt-10 sm:mt-12 xl:w-2/5" id="notify">
				<div className="sm:mx-auto sm:max-w-xl lg:mx-0 lg:max-w-full">
					<div className="justify-center sm:flex">
						<div className="animate-dropglowSM mt-3 rounded-sm sm:mt-0">
							<button
								type="button"
								onClick={() => {
									window.location.href = 'https://app.devclad.com';
								}}
								className="block w-full rounded-md border-[1px] border-neutral-600 bg-black  py-3 px-6 text-xl font-light text-white duration-500
								 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-neutral-900"
							>
								Join DevClad
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
