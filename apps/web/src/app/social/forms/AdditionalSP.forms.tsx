import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from '@headlessui/react';
import { VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import { classNames } from '@devclad/lib';
import { AdditionalSP } from '@/app/social/types';
import { updateAdditionalSP } from '@/services/profile.services';
import { Error, Success } from '@/components/Feedback';
import { ProfileLoading } from '../../../components/LoadingStates';
import { useAdditionalSP } from '@/services/socialHooks.services';
import { useAuth } from '@/services/useAuth.services';
import { daysOfWeek, hoursOfDay } from '@/app/social/forms/utils';

export function AdditionalSPForm() {
	const { token } = useAuth();
	const profile = useAdditionalSP();
	const qc = useQueryClient();
	const state = qc.getQueryState(['additional-sprefs']);
	const [videoCallFriendly, setVideoCallFriendly] = useState(false);
	const [availableAlwaysOff, setAvailableAlwaysOff] = useState(false);

	const [selectedDay, setSelectedDay] = useState<{ name: string; id: number }>();
	const [selectedTime, setSelectedTime] = useState<{ name: string; id: number }>();

	if (state?.status === 'loading' || state?.status !== 'success' || profile === null) {
		return <ProfileLoading />;
	}

	if (state?.status === 'success' && profile !== null) {
		if (availableAlwaysOff !== profile.available_always_off) {
			setAvailableAlwaysOff(profile.available_always_off);
		}
		if (videoCallFriendly !== profile.video_call_friendly) {
			setVideoCallFriendly(profile.video_call_friendly);
		}
		if (selectedDay?.name !== profile.preferred_day) {
			setSelectedDay(daysOfWeek.find((day) => day.name === profile.preferred_day));
		}
		if (selectedTime?.name !== profile.preferred_time) {
			setSelectedTime(hoursOfDay.find((time) => time.name === profile.preferred_time));
		}
	}

	const handleSubmit = async (values: AdditionalSP) => {
		await updateAdditionalSP(token, values)
			?.then(async () => {
				toast.custom(<Success success="Preferences saved successfully" />, {
					id: `ad-prefs-success${Math.random()}`,
					duration: 1000,
				});
				await qc.invalidateQueries(['additional-sprefs']);
			})
			.catch(() => {
				toast.custom(<Error error="Something went wrong" />, {
					id: `ad-prefs-error${Math.random()}`,
					duration: 3000,
				});
			});
	};

	return (
		<div className="space-y-4">
			<Switch.Group as="div" className="flex items-center">
				<Switch
					checked={videoCallFriendly}
					onChange={() => {
						setVideoCallFriendly(!videoCallFriendly);
						handleSubmit({ ...profile, video_call_friendly: !videoCallFriendly });
					}}
					className={classNames(
						profile.video_call_friendly ? 'bg-orange-200' : 'bg-neutral-700',
						'relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-sm border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2'
					)}
				>
					<span
						aria-hidden="true"
						className={classNames(
							profile.video_call_friendly
								? 'translate-x-6 bg-black'
								: 'translate-x-0 bg-white',
							'pointer-events-none inline-block h-5 w-5 transform rounded-sm shadow ring-0 transition duration-200 ease-in-out'
						)}
					/>
				</Switch>
				<Switch.Label as="span" className="ml-3 flex">
					{profile.video_call_friendly ? (
						<VideoCameraIcon className="mr-2 h-8 w-8 text-orange-200" />
					) : (
						<VideoCameraSlashIcon className="mr-2 h-8 w-8 text-neutral-500" />
					)}
				</Switch.Label>
				<span className="text-sm sm:text-base">
					Video Call Friendly{!profile.video_call_friendly && '?'}
				</span>
			</Switch.Group>
			<Switch.Group as="div" className="flex items-center">
				<Switch
					checked={!availableAlwaysOff}
					onChange={() => {
						setAvailableAlwaysOff(!availableAlwaysOff);
						handleSubmit({ ...profile, available_always_off: !availableAlwaysOff });
					}}
					className={classNames(
						availableAlwaysOff ? 'bg-neutral-700' : 'bg-orange-200',
						'relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-sm border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2'
					)}
				>
					<span
						aria-hidden="true"
						className={classNames(
							availableAlwaysOff
								? 'translate-x-0 bg-white'
								: 'translate-x-6 bg-black',
							'pointer-events-none inline-block h-5 w-5 transform rounded-sm shadow ring-0 transition duration-200 ease-in-out'
						)}
					/>
				</Switch>
				<Switch.Label as="span" className="ml-3 flex">
					<span className="text-sm sm:text-base">
						{availableAlwaysOff ? (
							<ClockIcon className="mr-2 h-8 w-8 text-neutral-500" />
						) : (
							<ClockIcon className="mr-2 h-8 w-8 text-orange-200" />
						)}
					</span>
				</Switch.Label>
				<span>
					{availableAlwaysOff ? (
						<span className="text-sm sm:text-base">
							1-on-1 Mode off until turned on
						</span>
					) : (
						<span className="text-sm sm:text-base">
							1-on-1 Mode on until turned off
						</span>
					)}
				</span>
			</Switch.Group>
			{profile.video_call_friendly === true && profile.available_always_off === false && (
				<div className="flex flex-col">
					<div className="container mt-5">
						<h3 className="mb-2 font-sans leading-6 text-neutral-700 dark:text-neutral-300 sm:text-lg">
							Preferred Day for Video Calls
						</h3>
						<div className="space-y-3 rounded-md duration-500">
							<nav className="flex space-x-2 font-mono" aria-label="Tabs">
								{daysOfWeek.slice(0, 3).map((tab) => (
									<button
										type="button"
										key={tab.name}
										onClick={() => {
											setSelectedDay(tab);
											handleSubmit({ ...profile, preferred_day: tab.name });
										}}
										className={classNames(
											tab.name === selectedDay?.name
												? ' border-solid border-neutral-600 shadow-2xl shadow-white/20 hover:text-white dark:text-orange-200'
												: 'border-dashed border-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-neutral-100',
											'rounded-md border-[1px] border-neutral-800 px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
										)}
									>
										{tab.name}
									</button>
								))}
							</nav>
							<nav className="flex space-x-2 font-mono" aria-label="Tabs">
								{daysOfWeek.slice(3, 6).map((tab) => (
									<button
										type="button"
										key={tab.name}
										onClick={() => {
											setSelectedDay(tab);
											handleSubmit({ ...profile, preferred_day: tab.name });
										}}
										className={classNames(
											tab.name === selectedDay?.name
												? ' border-solid border-neutral-600 shadow-2xl shadow-white/20 hover:text-white dark:text-orange-200'
												: 'border-dashed border-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-neutral-100',
											'rounded-md border-[1px] px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
										)}
									>
										{tab.name}
									</button>
								))}
							</nav>
							<nav className="flex space-x-2 font-mono" aria-label="Tabs">
								{daysOfWeek.slice(6, 8).map((tab) => (
									<button
										type="button"
										key={tab.name}
										onClick={() => {
											setSelectedDay(tab);
											handleSubmit({ ...profile, preferred_day: tab.name });
										}}
										className={classNames(
											tab.name === selectedDay?.name
												? ' border-solid border-neutral-600 shadow-2xl shadow-white/20 hover:text-white dark:text-orange-200'
												: 'border-dashed border-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-neutral-100',
											'rounded-md border-[1px] px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
										)}
									>
										{tab.name}
									</button>
								))}
							</nav>
						</div>
					</div>
					<div className="container mt-5">
						<h3 className="mb-2 font-sans leading-6 text-neutral-700 dark:text-neutral-300 sm:text-lg">
							Preferred Time for Video Calls
						</h3>
						<div className="space-y-3 rounded-md duration-500">
							<nav className="flex space-x-2 font-mono" aria-label="Tabs">
								{hoursOfDay.slice(0, 3).map((tab) => (
									<button
										type="button"
										key={tab.name}
										onClick={() => {
											setSelectedTime(tab);
											handleSubmit({ ...profile, preferred_time: tab.name });
										}}
										className={classNames(
											tab.name === selectedTime?.name
												? ' border-solid border-neutral-600 shadow-2xl shadow-white/20 hover:text-white dark:text-orange-200'
												: 'hover:text-neutral-900border-neutral-800 border-dashed text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-100',
											'rounded-md border-[1px] border-neutral-800 px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
										)}
									>
										{tab.name}
									</button>
								))}
							</nav>
							<nav className="flex space-x-2 font-mono" aria-label="Tabs">
								{hoursOfDay.slice(3, 6).map((tab) => (
									<button
										type="button"
										key={tab.name}
										onClick={() => {
											setSelectedTime(tab);
											handleSubmit({ ...profile, preferred_time: tab.name });
										}}
										className={classNames(
											tab.name === selectedTime?.name
												? ' border-solid border-neutral-600 shadow-2xl shadow-white/20 hover:text-white dark:text-orange-200'
												: 'border-dashed border-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-neutral-100',
											'rounded-md border-[1px] px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
										)}
									>
										{tab.name}
									</button>
								))}
							</nav>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
