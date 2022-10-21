import React from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { useSlowContext } from '@/context/Speed.context';

export default function QueryLoader() {
	const isFetching = useIsFetching();
	const { slowMode, toggle } = useSlowContext();
	const [time, setTime] = React.useState(0);
	React.useEffect(() => {
		// sloppy way for TypeSafety; couldn't think of a better way yet
		let interval: ReturnType<typeof setInterval> = null as unknown as ReturnType<
			typeof setInterval
		>;
		if (isFetching) {
			setTime((t) => t + 1);
			interval = setInterval(() => {
				setTime((t) => t + 1);
			}, 1000);
		} else {
			setTime(0);
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, [isFetching]);
	if (time > 10 && isFetching) {
		toggle(true);
	}
	if (!isFetching) {
		toggle(false);
	}
	if (slowMode && isFetching) {
		// works considering users are not constantly switching
		// back and forth between slow and fast connections
		// jic: I've added sessionstorage to persist the slowMode state if we want to later
		toast.custom(
			<PrimaryButton>
				<svg
					className="-ml-1 mr-3 h-8 w-6 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
					/>
					<path
						className="opacity-100"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			</PrimaryButton>,
			{
				duration: 3000,
				id: 'slow-connection',
			}
		);
	}
	return null;
}
