import React from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

export default function Footer(): JSX.Element {
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
