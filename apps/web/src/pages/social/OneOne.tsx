import React from 'react';
import {
	ChatBubbleBottomCenterIcon,
	ExclamationTriangleIcon,
	PlusCircleIcon,
	VideoCameraIcon,
	CalendarIcon,
	ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@devclad/lib';
import { greenString, redString, warningString, badge, PrimaryButton } from '@/lib/Buttons.lib';
import {
	useCircle,
	useOneOneProfile,
	useOneOneUsernames,
	useSkippedUsernames,
	useShadowedUsernames,
	useConnected,
} from '@/services/socialHooks.services';
import { MatchProfile } from '@/pages/social/types';
import { ProfileLoading } from '@/components/LoadingStates';
import { genExp, genIdea } from '@/pages/Profile';
import { useAuth } from '@/services/useAuth.services';
import { patchCircle, shadowUser, skipUser } from '@/services/profile.services';
import { Success, Error } from '@/components/Feedback';
import { ActionDialog, ScheduleDialog } from '@/pages/social/components/ActionDialogs';
import { API_URL, DEVELOPMENT } from '@/services/auth.services';

function MatchCard({ username }: { username: string }): JSX.Element {
	const profile = useOneOneProfile(username) as MatchProfile;
	const qc = useQueryClient();
	const state = qc.getQueryState(['profile', username]);
	// logged in username and connection check
	const { token, loggedInUser } = useAuth();
	const loggedInUserUserName = loggedInUser.username;
	const connected = useConnected(username);
	// logged in username and connection check
	const { usernames: skippedUsers } = useSkippedUsernames();
	const { usernames: shadowedUsers } = useShadowedUsernames();
	const { usernames: circle } = useCircle();

	const [open, setOpen] = React.useState(false);
	const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false);
	const [action, setAction] = React.useState('');
	const [scheduleAction, setScheduleAction] = React.useState('');
	const cancelButtonRef = React.useRef<HTMLButtonElement>(null);
	const scheduleButtonRef = React.useRef<HTMLButtonElement>(null);

	const handleAdd = async () => {
		await patchCircle(token, username, circle, 'add')
			?.then(async () => {
				toast.custom(<Success success="Added to circle" />, {
					id: `connect-profile-success${Math.random()}`,
					duration: 3000,
				});
				await qc.invalidateQueries(['circle', loggedInUserUserName as string]);
				await qc.invalidateQueries(['circle', username]);
			})
			.catch(() => {
				toast.custom(<Error error="Something went wrong." />, {
					id: `connect-profile-error${Math.random()}`,
					duration: 5000,
				});
			});
	};

	const handleSkip = async () => {
		await skipUser(token, username, skippedUsers, true)
			?.then(async () => {
				toast.custom(<Success success="Skipped successfully" />, {
					id: `skip-profile-success${Math.random()}`,
					duration: 3000,
				});
				await qc.invalidateQueries(['skipped']);
				await qc.invalidateQueries(['matches']);
			})
			.catch(() => {
				toast.custom(<Error error="Something went wrong." />, {
					id: `skip-profile-error${Math.random()}`,
					duration: 3000,
				});
			});
	};

	const handleShadow = async () => {
		await shadowUser(token, username, shadowedUsers, true)
			?.then(async () => {
				toast.custom(<Success success="Shadowed successfully" />, {
					id: `shadow-profile-success${Math.random()}`,
					duration: 3000,
				});
				await qc.invalidateQueries(['shadowed']);
				await qc.invalidateQueries(['matches']);
			})
			.catch(() => {
				toast.custom(<Error error="Something went wrong." />, {
					id: `shadow-profile-error${Math.random()}`,
					duration: 3000,
				});
			});
	};

	if (state?.status === 'loading' || state?.status !== 'success' || profile === null) {
		return <ProfileLoading />;
	}
	if (profile) {
		return (
			<>
				{open ? (
					<ActionDialog
						open={open}
						setOpen={setOpen}
						cancelButtonRef={cancelButtonRef}
						firstName={profile.first_name || ''}
						action={action}
						onConfirm={() => {
							if (action === 'warn') handleSkip();
							else if (action === 'danger') handleShadow();
						}}
					/>
				) : null}
				{scheduleModalOpen ? (
					<ScheduleDialog
						open={scheduleModalOpen}
						setOpen={setScheduleModalOpen}
						scheduleButtonRef={scheduleButtonRef}
						otherUser={{
							firstName: profile.first_name,
							username,
						}}
						loggedInUser={loggedInUser}
						action={scheduleAction}
					/>
				) : null}
				<div className="flex justify-center p-0 lg:p-4">
					<div className="bg-darkBG2 w-full rounded-md border-[1px] border-neutral-400 shadow dark:border-neutral-800 lg:w-3/4">
						<div className="space-y-2 px-4 py-5 sm:p-6">
							<div className="sm:inline-flex">
								<div className="flex flex-col">
									<div className="flex-shrink-0">
										<img
											className="bg-linen h-32 w-32 rounded-full object-cover sm:h-24 sm:w-24"
											src={
												DEVELOPMENT
													? API_URL + profile.avatar
													: profile.avatar
											}
											alt=""
										/>
									</div>
								</div>
								<h2
									className="mt-4 font-sans text-2xl font-black leading-6 text-neutral-900 dark:text-neutral-100
                 sm:ml-4 sm:text-3xl"
								>
									{profile.first_name} {profile.last_name}{' '}
									<div className="ml-1 inline-flex text-base text-neutral-600 dark:text-neutral-400">
										{profile.pronouns ? `(${profile.pronouns})` : ''}
									</div>
									{profile.video_call_friendly && (
										<span className="mt-5 mb-5 block sm:mt-0 sm:mb-0">
											<div className="-mt-4 flex-shrink-0">
												<span
													className="bg-phthaloGreen text-honeyDew inline-flex items-center rounded-md
                        px-2.5 py-0.5 text-xs font-medium"
												>
													👋 Video Call Friendly
												</span>
											</div>
										</span>
									)}
								</h2>
							</div>
							<div
								className="dark:bg-darkBG rounded-lg
               border-[1px] border-neutral-200 p-4 text-neutral-800
               dark:border-neutral-800 dark:border-l-orange-200 dark:text-neutral-200 sm:ml-24"
							>
								<div className="italic text-neutral-300">
									<p>
										&quot;
										{profile.about}
										&quot;
									</p>
								</div>
							</div>
							<div className="-ml-4 flex flex-col space-y-4 rounded-md pt-4 pl-4 sm:ml-20">
								<div className="flex flex-row space-x-2 text-sm">
									{profile.calendly && (
										<div className="flex rounded-md bg-blue-800/20 p-2 text-blue-400">
											<button
												type="button"
												className="flex flex-row space-x-1"
												onClick={() =>
													window.open(profile.calendly, '_blank')
												}
											>
												<CalendarIcon
													className="h-6 w-5"
													aria-hidden="true"
												/>
												<span className="">Calendly</span>
											</button>
										</div>
									)}
									{profile.linkedin && (
										<div className="flex rounded-md bg-blue-800/20 p-2 text-blue-400">
											<button
												type="button"
												className="flex flex-row"
												onClick={() =>
													window.open(profile.linkedin, '_blank')
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
												>
													<path
														className="fill-blue-400"
														d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762
                          0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966
                          0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75
                          1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586
                          7-2.777 7 2.476v6.759z"
													/>
												</svg>
											</button>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col rounded-md pb-4 sm:ml-20 sm:pl-4">
								{profile.languages && (
									<span className="block space-x-2 space-y-4">
										{badge(
											profile.languages,
											'bg-darkBG text-sm font-mono font-medium text-amber-200'
										)}
									</span>
								)}
							</div>

							<div className="flex flex-col space-y-2 rounded-md pb-4 sm:ml-20 sm:pl-4">
								{/* TODO: add GITHUB */}
								<div className="sm:text-md flex flex-row space-x-2 text-sm">
									{profile.location && profile.location !== 'Other' && (
										<div className="bg-darkBG flex rounded-md p-2 text-amber-200">
											🌎 {profile.location}
										</div>
									)}
									<div className="bg-darkBG flex rounded-md p-2 text-amber-200">
										🕛 {profile.timezone} Time
									</div>
								</div>
							</div>
							<div
								className="dark:bg-darkBG rounded-lg border-[1px]
               border-neutral-200 p-4 text-neutral-800
               dark:border-neutral-800 dark:border-l-orange-200 dark:text-neutral-200 sm:ml-24"
							>
								<div className="flex flex-col">
									{/* TODO: add GITHUB */}
									<div className="bg-darkBG space-y-2">
										{!profile.website && (
											<button
												type="button"
												className="flex rounded-sm
                      bg-black p-2 text-sm"
											>
												<ArrowUpRightIcon
													className="mr-1 h-6 w-4"
													aria-hidden="true"
												/>
												<a
													href={profile.website}
													target="_blank"
													rel="noreferrer"
												>
													Link by {profile.first_name}{' '}
												</a>
											</button>
										)}
										<span className="block space-x-2 space-y-2">
											⚡ {profile.first_name} is good at{' '}
											{profile.dev_type &&
												badge(
													profile.dev_type,
													'lg:ml-1 bg-darkBG2 text-sm font-mono font-medium text-amber-200'
												)}{' '}
										</span>
										<span className="block">
											🧲 Interested in working with{' '}
											{profile.preferred_dev_type} developers.
										</span>
										<span className="block">
											⚒️ Hacking stuff together for{' '}
											{profile.raw_xp && genExp(profile.raw_xp)} now.
										</span>
									</div>
								</div>
							</div>
							<div
								className="dark:bg-darkBG rounded-lg border-[1px]
               border-neutral-200 p-4 text-neutral-800
               dark:border-neutral-800 dark:border-l-orange-200 dark:text-neutral-200 sm:ml-24"
							>
								<div className="flex flex-col">
									<div className="bg-darkBG space-y-2 italic text-neutral-300">
										<span className="block">
											&quot;
											{profile.idea_status &&
												genIdea(profile.idea_status)}{' '}
											<span className="lowercase">{profile.idea_status}</span>
											&quot;
										</span>
									</div>
								</div>
							</div>
							<div
								className="dark:bg-darkBG rounded-lg border-[1px]
               border-neutral-200 p-4 text-neutral-800
               dark:border-neutral-800 dark:border-l-orange-200 dark:text-neutral-200 sm:ml-24"
							>
								<div className="flex flex-col">
									<div className="bg-darkBG space-y-2">
										{profile.purpose && (
											<span className="block space-y-2">
												<span className="flex">
													Why is {profile.first_name} here?
												</span>
												<span className="block space-y-2 sm:space-x-2">
													{badge(
														profile.purpose,
														'bg-darkBG2 text-sm font-mono font-medium text-amber-200'
													)}
												</span>
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="text-md flex justify-start space-x-2 pt-4 sm:ml-24">
								<div className="flex flex-col">
									<Link className="flex" to={`/messages/${username}/`}>
										<PrimaryButton>
											<ChatBubbleBottomCenterIcon
												className="mr-2 h-6 w-6 lg:h-8"
												aria-hidden="true"
											/>
											Chat
										</PrimaryButton>
									</Link>
								</div>
								<div className="flex flex-col">
									<PrimaryButton
										onClick={() => {
											setScheduleAction('schedule');
											setScheduleModalOpen(true);
										}}
									>
										<VideoCameraIcon
											className="mr-2 h-6 w-6 lg:h-8"
											aria-hidden="true"
										/>
										Schedule
									</PrimaryButton>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div key="actions" className="relative p-8">
					<div className="absolute inset-0 flex items-center" aria-hidden="true">
						<div className="w-full border-t border-neutral-100 dark:border-neutral-800" />
					</div>
					<div className="relative hidden justify-evenly sm:hidden md:visible md:flex">
						<div className="-mt-5 flex justify-center">
							<button
								type="button"
								className={warningString}
								onClick={() => {
									setAction('warn');
									setOpen(true);
								}}
							>
								<ExclamationTriangleIcon
									className="mr-2 h-6 w-5"
									aria-hidden="true"
								/>
								<span className="text-xs">Pass For 4 Weeks</span>
							</button>
						</div>
						<div className="-mt-5 flex justify-center">
							{!connected ? (
								<button type="button" className={greenString} onClick={handleAdd}>
									<PlusCircleIcon className="mr-2 h-6 w-5" aria-hidden="true" />
									<span>Add To Circle</span>
								</button>
							) : (
								<button type="button" className={greenString}>
									<CheckIcon className="mr-2 h-6 w-5" aria-hidden />
									<span>Added To Circle</span>
								</button>
							)}
						</div>
						<div className="-mt-5 flex justify-center">
							<button
								type="button"
								className={redString}
								onClick={() => {
									setAction('danger');
									setOpen(true);
								}}
							>
								<XMarkIcon className="mr-2 h-6 w-5" aria-hidden="true" />
								<span className="text-xs">Never Show Again</span>
							</button>
						</div>
					</div>
				</div>
			</>
		);
	}
	return <div />;
}

export function OneOne(): JSX.Element {
	useDocumentTitle('Social Mode');
	const qc = useQueryClient();
	const { usernames } = useOneOneUsernames();

	const state = qc.getQueryState(['matches']);
	return (
		<>
			{(state?.status === 'loading' || state?.status !== 'success' || usernames === null) && (
				<ProfileLoading />
			)}
			{usernames?.map((username) => (
				<MatchCard key={username} username={username} />
			))}
			<div key="tips" className="flex justify-center p-4">
				<div className="rounded-lg border-[1px] border-neutral-800 shadow dark:bg-black sm:w-full md:w-3/4">
					<div className="space-y-4 px-4 py-5 sm:p-6">
						<div className="mb-5 flex flex-col">
							<h2 className="font-sans text-2xl font-black leading-6 text-neutral-900 dark:text-neutral-100">
								Prompts for Conversation/Tips
							</h2>
						</div>
						<div className="text-md bg-darkBG rounded-md border-[1px] border-neutral-800 border-l-orange-200 p-4 text-neutral-800 dark:text-neutral-300">
							<ol className="list-inside list-decimal space-y-2">
								<li>Favorite tools and languages.</li>
								<li>
									OSS projects to keep track of right now in
									<span> {new Date().getFullYear()}</span> in your opinion.
								</li>
								<li>&ldquo;What are you working on right now?&rdquo;</li>
								<li>
									&ldquo;What do you like doing apart from programming?&rdquo;
									{` `}
									<span className="text-sm text-neutral-500 dark:text-neutral-400">
										This is usually the sweet spot for side-projects (hobby+dev
										skills).
									</span>
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
