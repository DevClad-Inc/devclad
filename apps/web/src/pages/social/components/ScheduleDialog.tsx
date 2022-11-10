import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Transition, Dialog } from '@headlessui/react';
import { classNames } from '@devclad/lib';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/services/useAuth.services';
import { User } from '@/lib/types.lib';
import { createUpdateMeeting } from '@/services/meetings.services';
import { Error, Success } from '@/components/Feedback';
import { MeetingCreateUpdate } from '@/pages/stream/types';
import { MeetingDate, useDaysOfWeek } from './ActionDialog';

export function ScheduleDialog({
	open,
	setOpen,
	scheduleButtonRef,
	otherUser,
	loggedInUser,
	action,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	scheduleButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
	otherUser: {
		firstName: string;
		username: string;
	};
	loggedInUser: User;
	action: string;
}) {
	const navigate = useNavigate();
	const [submitted, setSubmitted] = React.useState(false);
	const [scheduled, setScheduled] = React.useState(false);
	const [selectedDay, setSelectedDay] = React.useState<MeetingDate>();
	const days = useDaysOfWeek();
	const { token } = useAuth();

	const processDate = (values: { date: Date; time: string }): string => {
		const { time } = values;
		const meetingDateTime = new Date(
			`${values.date.toLocaleDateString()} ${time}`
		).toISOString();
		return meetingDateTime;
	};

	const apiCall = async (values: MeetingCreateUpdate) => {
		await createUpdateMeeting(token, values)
			?.then(() => {
				setSubmitted(true);
				setScheduled(true);
				toast.custom(<Success success="Meeting Scheduled!" />, {
					id: `success-schedule${Math.random()}`,
					duration: 5000,
				});
			})
			.catch(() => {
				toast.custom(<Error error="Something went wrong. Check logs and report." />, {
					id: `error-schedule${Math.random()}`,
					duration: 5000,
				});
			});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const time = e.currentTarget.time.value;
		if (selectedDay) {
			const processedTime = processDate({
				date: selectedDay?.date,
				time: time || '',
			});
			const now = new Date();
			const meetingDate = new Date(processedTime);
			if (meetingDate.getTime() < now.getTime()) {
				toast.custom(<Error error="Please select the time in future." />, {
					id: `past-error${Math.random()}`,
					duration: 3000,
				});
				return;
			}
			const meeting: MeetingCreateUpdate = {
				name: `15-min 1-on-1 | ${loggedInUser.first_name} <-> ${otherUser.firstName}`,
				invites: [otherUser.username],
				type_of: '1:1 Match',
				time: processedTime,
				organizer: loggedInUser.username || '',
			};
			apiCall(meeting).then(() => {
				navigate('/meetings');
			});
		} else {
			toast.custom(<Error error="Please select the day." />, {
				id: `day-select-error${Math.random()}`,
				duration: 3000,
			});
		}
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={scheduleButtonRef}
				onClose={setOpen}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-in duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="bg-darkBG2 fixed inset-0 bg-opacity-90 backdrop-blur-sm transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<form onSubmit={handleSubmit}>
								<Dialog.Panel
									className="
                relative transform
                overflow-hidden rounded-lg
                border-[1px]
                border-neutral-600 bg-black px-4
                pt-5 pb-4 text-left shadow-sm shadow-white/20
                backdrop-blur-sm transition-all sm:my-8
                sm:w-full sm:max-w-lg sm:p-6
                "
								>
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
											{action === 'schedule' && (
												<CalendarDaysIcon
													className="h-16 w-16 text-orange-200"
													aria-hidden="true"
												/>
											)}
										</div>
										<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
											<Dialog.Title
												as="h3"
												className="text-lg font-medium leading-6 text-white"
											>
												Schedule 1-on-1 call with {otherUser.firstName}
											</Dialog.Title>
											<div className="mt-2">
												<div className="flex flex-col">
													<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
														Chat with your 1-on-1 match before
														scheduling to avoid scheduliing conflicts.
													</p>
													<div className="container mt-3">
														<h3 className="mb-2 font-sans leading-6 text-neutral-300 sm:text-lg">
															Choose a day
														</h3>
														<div className="space-y-3 rounded-md duration-500">
															<nav
																className="flex space-x-2 font-mono"
																aria-label="Tabs"
															>
																{days.slice(0, 3).map((tab) => (
																	<button
																		type="button"
																		key={tab.day}
																		onClick={() => {
																			setSelectedDay(tab);
																		}}
																		className={classNames(
																			tab.day ===
																				selectedDay?.day
																				? ' border-solid border-neutral-600 text-orange-200 shadow-2xl shadow-white/20 hover:text-white'
																				: 'border-dashed border-neutral-800 text-neutral-600 hover:text-neutral-100',
																			'rounded-md border-[1px] px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
																		)}
																	>
																		{tab.month},{' '}
																		{tab.date.getDate()} (
																		{tab.day})
																	</button>
																))}
															</nav>
															<nav
																className="flex space-x-2 font-mono"
																aria-label="Tabs"
															>
																{days.slice(3, 6).map((tab) => (
																	<button
																		type="button"
																		key={tab.day}
																		onClick={() => {
																			setSelectedDay(tab);
																		}}
																		className={classNames(
																			tab.day ===
																				selectedDay?.day
																				? ' border-solid border-neutral-600 text-orange-200 shadow-2xl shadow-white/20 hover:text-white'
																				: 'border-dashed border-neutral-800 text-neutral-600 hover:text-neutral-100',
																			'rounded-md border-[1px] px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
																		)}
																	>
																		{tab.month},{' '}
																		{tab.date.getDate()} (
																		{tab.day})
																	</button>
																))}
															</nav>
															<nav
																className="flex space-x-2 font-mono"
																aria-label="Tabs"
															>
																{days.slice(6, 7).map((tab) => (
																	<button
																		type="button"
																		key={tab.day}
																		onClick={() => {
																			setSelectedDay(tab);
																		}}
																		className={classNames(
																			tab.day ===
																				selectedDay?.day
																				? 'border-solid border-neutral-600 text-orange-200 shadow-2xl shadow-white/20 hover:text-white'
																				: 'border-dashed border-neutral-800 text-neutral-600 hover:text-neutral-100',
																			'rounded-md border-[1px] px-3 py-1 font-light duration-300 sm:px-3 lg:px-6'
																		)}
																	>
																		{tab.month},{' '}
																		{tab.date.getDate()} (
																		{tab.day})
																	</button>
																))}
															</nav>
														</div>
													</div>
													<div className="container mt-2">
														<h3 className="mb-2 font-sans leading-6 text-neutral-300 sm:text-lg">
															Select time
														</h3>
														<div className="space-y-3 rounded-md duration-500">
															<input
																type="time"
																name="time"
																id="time"
																className="rounded-md border-[1px] border-solid border-neutral-600 px-3 py-1 font-light text-slate-900
															  shadow-2xl shadow-white/20 invert filter duration-300 sm:px-3 lg:px-6"
																step={900}
																required
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
										<button
											type="submit"
											className="mt-3 inline-flex w-full justify-center rounded-md border border-white
										 bg-orange-200 px-6 py-1 text-base font-medium
										text-black shadow-sm duration-300 hover:bg-orange-300 focus:outline-none
										  focus:ring-2 focus:ring-neutral-200
										  sm:mt-0 sm:w-auto sm:text-sm"
											ref={scheduleButtonRef}
											disabled={submitted}
										>
											{submitted ? 'Scheduled' : 'Schedule'}
										</button>
										{!scheduled && (
											<button
												type="button"
												className="hover:bg-raisinBlack2 mt-3 inline-flex w-full justify-center rounded-md
                  border border-neutral-600 bg-black px-6 py-1 text-base
                  font-medium text-white shadow-sm duration-300 focus:outline-none
                    focus:ring-1 focus:ring-orange-300 focus:ring-offset-2
                    sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
												onClick={() => setOpen(false)}
											>
												Cancel
											</button>
										)}
									</div>
								</Dialog.Panel>
							</form>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
