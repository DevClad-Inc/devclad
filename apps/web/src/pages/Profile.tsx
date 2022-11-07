import React from 'react';
import {
	XMarkIcon,
	ChatBubbleBottomCenterIcon,
	VideoCameraIcon,
	CalendarIcon,
	ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { NoSymbolIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useDocumentTitle } from '@devclad/lib';
import { badge, PrimaryButton } from '@/lib/Buttons.lib';
import {
	useCircle,
	useOneOneProfile,
	useConnected,
	useBlocked,
	useBlockedUsernames,
} from '@/services/socialHooks.services';
import { MatchProfile } from '@/pages/social/types';
import { ProfileLoading } from '@/components/LoadingStates';
import ActionDropdown from '@/components/ActionDropdown';
import { blockUser, patchCircle } from '@/services/profile.services';
import { useAuth } from '@/services/useAuth.services';
import { Success, Error } from '@/components/Feedback';
import { DEVELOPMENT, API_URL } from '@/services/auth.services';

export const genExp = (rawXP: number) => {
	if (rawXP === 1) {
		return 'about a year';
	}
	return `${rawXP} years`;
};

export const genIdea = (idea: string) => {
	if (idea.toLowerCase().includes('need')) {
		return 'I';
	}
	return 'I am';
};

function ProfileCard({ username }: { username: string }): JSX.Element {
	const profile = useOneOneProfile(username) as MatchProfile;
	const qc = useQueryClient();
	const state = qc.getQueryState(['profile', username]);
	// logged in username and connection check
	const { token, loggedInUser } = useAuth();
	const loggedInUserUserName = loggedInUser.username;
	const connected = useConnected(username);
	const blocked = useBlocked(username);
	// logged in username and connection check
	const { usernames: circle } = useCircle();
	const { usernames: blockedUsers } = useBlockedUsernames();

	if (state?.status === 'loading' || state?.status !== 'success' || profile === null) {
		return <ProfileLoading />;
	}
	const handleAdd = async () => {
		await patchCircle(token, username, circle, 'add')
			?.then(async () => {
				toast.custom(<Success success="Added to circle" />, {
					id: 'connect-profile-success',
					duration: 3000,
				});
				await qc.invalidateQueries(['circle', loggedInUserUserName as string]);
			})
			.catch(() => {
				toast.custom(<Error error="User not in matches this week." />, {
					id: 'error-connect-profile',
					duration: 5000,
				});
			});
	};

	const handleDisconnect = async () => {
		await patchCircle(token, username, circle, 'remove')
			?.then(async () => {
				toast.custom(<Success success="Removed from circle" />, {
					id: 'disconnect-profile-success',
					duration: 3000,
				});
				await qc.invalidateQueries(['circle', loggedInUserUserName as string]);
			})
			.catch(() => {
				toast.custom(<Error error="Something went wrong." />, {
					id: 'error-disconnect-profile',
					duration: 5000,
				});
			});
	};

	const connectedOnlyItems = [
		{
			name: 'Disconnect',
			icon: XMarkIcon,
			alt: 'Disconnect',
			onClick: handleDisconnect,
		},
	];
	let dropdownItems = [
		{
			name: 'Block',
			icon: NoSymbolIcon,
			alt: 'Block',
			onClick: async () => {
				await blockUser(token, username, blockedUsers, 'block')
					?.then(async () => {
						toast.custom(<Success success="Blocked user successfully" />, {
							id: 'block-profile-success',
							duration: 3000,
						});
						await qc.invalidateQueries(['circle']);
						await qc.invalidateQueries(['blocked']);
					})
					.catch(() => {
						toast.custom(<Error error="Something went wrong." />, {
							id: 'error-block-profile',
							duration: 5000,
						});
					});
			},
		},
	];
	switch (true) {
		case connected:
			dropdownItems = [...connectedOnlyItems, ...dropdownItems];
			break;
		case blocked && loggedInUserUserName !== username:
			dropdownItems = [
				{
					name: 'Unblock',
					icon: NoSymbolIcon,
					alt: 'Unblock',
					onClick: async () => {
						await blockUser(token, username, blockedUsers, 'unblock')
							?.then(async () => {
								toast.custom(<Success success="Unblocked user successfully" />, {
									id: 'unblock-profile-success',
									duration: 3000,
								});
								await qc.invalidateQueries(['circle']);
								await qc.invalidateQueries(['blocked']);
							})
							.catch(() => {
								toast.custom(<Error error="Something went wrong." />, {
									id: 'error-unblock-profile',
									duration: 5000,
								});
							});
					},
				},
			];
			break;
		default:
			dropdownItems = [
				{
					name: 'Connect',
					icon: PlusIcon,
					alt: 'Connect',
					onClick: handleAdd,
				},
				...dropdownItems,
			];
	}

	if (profile) {
		return (
			<div className="flex justify-center p-0 lg:p-4">
				<div className="bg-darkBG2 w-full rounded-md border-[1px] border-neutral-400 shadow dark:border-neutral-800 lg:w-3/4">
					<div className="space-y-2 px-4 py-5 sm:p-6">
						<div className="sm:inline-flex">
							<div className="flex flex-col">
								<div className="flex-shrink-0">
									<img
										className="bg-linen h-32 w-32 rounded-full object-cover sm:h-24 sm:w-24"
										src={
											DEVELOPMENT ? API_URL + profile.avatar : profile.avatar
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
							className="dark:bg-darkBG rounded-lg border-[1px]
               border-neutral-200 p-4 text-neutral-800
               dark:border-neutral-800 dark:text-neutral-200 sm:ml-24"
						>
							<div className="italic text-neutral-300">
								<p>
									&quot;
									{profile.about}
									&quot;
								</p>
							</div>
						</div>
						{!blocked && (
							<>
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
								<div className="-ml-4 flex flex-col space-y-2 rounded-md pb-4 pl-4 sm:ml-20">
									<div className="sm:text-md flex flex-row space-x-2 font-mono text-sm">
										{profile.languages &&
											badge(
												profile.languages,
												'bg-darkBG font-medium text-amber-200'
											)}
									</div>

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
               dark:border-neutral-800 dark:text-neutral-200 sm:ml-24"
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
											<span className="block">
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
               dark:border-neutral-800 dark:text-neutral-200 sm:ml-24"
								>
									<div className="flex flex-col">
										<div className="bg-darkBG space-y-2 italic text-neutral-300">
											<span className="block">
												&quot;
												{profile.idea_status &&
													genIdea(profile.idea_status)}{' '}
												<span className="lowercase">
													{profile.idea_status}
												</span>
												&quot;
											</span>
										</div>
									</div>
								</div>
								<div
									className="dark:bg-darkBG rounded-lg border-[1px]
               border-neutral-200 p-4 text-neutral-800
               dark:border-neutral-800 dark:text-neutral-200 sm:ml-24"
								>
									<div className="flex flex-col">
										<div className="bg-darkBG space-y-2">
											{profile.purpose && (
												<span className="block space-y-2">
													<span className="flex">
														Why is {profile.first_name} here?
													</span>
													<span className="block space-x-2 space-y-2">
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
							</>
						)}
						<div className="text-md flex justify-start space-x-2 pt-4 sm:ml-24">
							{!blocked && (
								<>
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
										<PrimaryButton>
											<VideoCameraIcon
												className="mr-2 h-6 w-6 lg:h-8"
												aria-hidden="true"
											/>
											Schedule
										</PrimaryButton>
									</div>
								</>
							)}
							<div className="flex flex-col">
								<ActionDropdown items={dropdownItems} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return <div />;
}

export function Profile(): JSX.Element {
	const { username } = useParams<{ username: string }>() as { username: string };
	useDocumentTitle(`Profile | ${username}`);
	return <ProfileCard key={username} username={username} />;
}
