import React from 'react';
import { Peer } from 'peerjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { convertTimeZone } from '@devclad/lib';
import { useAuth } from '@/services/useAuth.services';
import { useSocialProfile } from '@/services/socialHooks.services';
import { DEVELOPMENT } from '@/services/auth.services';
import { meetingQuery } from '@/lib/queries.lib';
import { Meeting } from '@/app/stream/types';
import { SocialProfile } from '@/app/social/types';
import { PrimaryButton } from '@/lib/Buttons.lib';

export function MeetingRoom(): JSX.Element {
	const qc = useQueryClient();
	const { token, loggedInUser } = useAuth();
	const { uid } = useParams<{ uid: string }>() as { uid: string };
	const [peerConnected, setPeerConnected] = React.useState(false);
	const [peerConnectError, setPeerConnectError] = React.useState(false);
	const socialProfile = useSocialProfile() as SocialProfile;
	const spState = qc.getQueryState(['social-profile']);
	const {
		data: meetingData,
		isLoading,
		isSuccess,
	} = useQuery({
		...meetingQuery(token, uid as string),
	});

	React.useEffect(() => {
		const createPeer = async (username: string) => {
			const peer = new Peer(`${uid + username}`, {
				secure: !DEVELOPMENT,
				host: import.meta.env.VITE_PEERJS_HOST,
				port: 443,
				path: '/peerjs',
				debug: DEVELOPMENT ? 3 : 0,
			});
			console.log('peer', peer);
		};

		if (isSuccess && meetingData !== null && loggedInUser) {
			createPeer(loggedInUser?.username as string);
		}
	}, [isSuccess, loggedInUser, meetingData, uid]);

	if (
		isLoading ||
		spState?.status === 'loading' ||
		spState?.status !== 'success' ||
		!socialProfile
	) {
		return <div>Loading...</div>;
	}
	if (isSuccess && meetingData !== null) {
		const { meetings: meeting } = meetingData.data as { meetings: Meeting };
		const time = socialProfile?.timezone as string;

		return (
			<div className="mt-5 flex h-full w-full flex-col items-center justify-center">
				<div className="flex h-full w-full flex-col items-center justify-center">
					<div className="mt-2 rounded-md border-[1px] border-neutral-800 p-4 text-center font-mono">
						<p className="font-sans text-xl">{meeting.name}</p>
						<p className="text-sm text-neutral-500">{meeting.type_of}</p>
						<p className="text-sm text-neutral-500">
							{convertTimeZone(meeting.time, time)}
						</p>
						<p className="text-sm text-neutral-500">{meeting.invites.join(', ')}</p>
					</div>
				</div>

				{peerConnected ? (
					<div className="h-full w-full items-center justify-center sm:flex">
						{/* Stream 1 */}
						<div className="items-center justify-center lg:mr-2 lg:flex lg:w-1/2 lg:flex-col">
							<div className="flex h-full w-full items-center justify-center lg:flex-col">
								{/* <iframe
                        height={typeof window !== 'undefined' ? window.innerHeight / 2 : 0}
                        width={
                            typeof window !== 'undefined' && window.innerWidth > 1024
                                ? window.innerWidth / 2.5
                                : window.innerWidth / 1.15
                        }
                        src="https://www.youtube.com/embed/DxmDPrfinXY/?autoplay=1&mute=1"
                        title="YouTube video player"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    /> */}
							</div>
							<div className="flex justify-center p-2">
								<PrimaryButton>Mute</PrimaryButton>
							</div>
						</div>

						{/* Stream 2 */}
						<div className="items-center justify-center lg:ml-2 lg:flex lg:w-1/2 lg:flex-col">
							<div className="flex h-full w-full items-center justify-center lg:flex-col">
								{/* <iframe
                        height={typeof window !== 'undefined' ? window.innerHeight / 2 : 0}
                        width={
                            typeof window !== 'undefined' && window.innerWidth > 1024
                                ? window.innerWidth / 2.5
                                : window.innerWidth / 1.15
                        }
                        src="https://www.youtube.com/embed/DxmDPrfinXY/?autoplay=1&mute=1"
                        title="YouTube video player"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    /> */}
							</div>
							<div className="flex justify-center p-2">
								<PrimaryButton>Mute</PrimaryButton>
							</div>
						</div>
					</div>
				) : (
					<div className="mt-5 text-center font-mono">
						<form
							className="space-y-6"
							onSubmit={(e) => {
								e.preventDefault();
								const target = e.target as typeof e.target & {
									peerId: { value: string };
								};
								console.log(target.peerId.value);
							}}
						>
							<label
								htmlFor="code"
								className="block pl-1 text-center text-sm
           text-neutral-700 dark:text-neutral-300"
							>
								<div className="relative mt-1">
									<input
										id="peerId"
										name="peerId"
										type="peerId"
										placeholder="Peer ID of your match"
										autoComplete="peer"
										required
										className="dark:bg-darkBG mt-1 block rounded-md border-[1px] border-neutral-800
                   px-4 py-2 shadow-sm sm:text-sm"
									/>
									{peerConnectError && (
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
											<ExclamationTriangleIcon
												className="text-bloodRed dark:text-mistyRose h-5 w-5"
												aria-hidden="true"
											/>
										</div>
									)}
								</div>
							</label>
							<PrimaryButton>Connect</PrimaryButton>
						</form>
					</div>
				)}
			</div>
		);
	}

	return <div>Meeting not found</div>;
}
