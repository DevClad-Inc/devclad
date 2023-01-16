import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CTA() {
	return (
		<>
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
			<div className="sm:justify-center lg:flex">
				<div className="mt-5 sm:mt-6 xl:w-2/5" id="notify">
					<div className="sm:mx-auto sm:max-w-xl lg:mx-0 lg:max-w-full">
						<div className="justify-center sm:flex">
							<Link
								href="https://www.producthunt.com/posts/devclad?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-devclad"
								target="_blank"
							>
								<Image
									src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373373&theme=dark"
									alt="DevClad - Meet&#0032;other&#0032;developers&#0032;1&#0058;1&#0032;&#0045;&#0032;team&#0032;up&#0032;on&#0032;projects&#0032;&#0043;&#0032;hackathons | Product Hunt"
									width={250}
									height={54}
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
