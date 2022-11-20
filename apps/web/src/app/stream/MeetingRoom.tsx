/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback } from 'react';
import { DataConnection, MediaConnection, Peer } from 'peerjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
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
	const peerObjectRef = React.useRef<Peer>();
	const peerCallRef = React.useRef<MediaConnection>();
	const peerDataRef = React.useRef<DataConnection>();
	const [peerConnected, setPeerConnected] = React.useState(false);
	const socialProfile = useSocialProfile() as SocialProfile;
	const spState = qc.getQueryState(['social-profile']);
	const remoteVideoRef = React.useRef<HTMLVideoElement>(null);

	const {
		data: meetingData,
		isLoading,
		isSuccess,
	} = useQuery({
		...meetingQuery(token, uid as string),
	});

	const callPeer = async () => {
		setPeerConnected(true);
		const meeting = meetingData?.data?.meetings as Meeting;
		const meetingInvite = meeting?.invites.find((invite) => invite !== loggedInUser?.username);
		const peerID = `${meetingInvite}-${uid}`;
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			peerDataRef.current = peerObjectRef.current?.connect(peerID);
			peerDataRef.current?.on('open', () => {
				peerDataRef.current?.send('connected');
			});
			const call = peerObjectRef.current?.call(peerID, stream);
			call?.on('stream', (remoteStream) => {
				const remoteVideo = remoteVideoRef.current;
				if (remoteVideo) {
					remoteVideo.srcObject = remoteStream;
					peerCallRef.current = call;
					remoteVideo.play();
				}
			});
		});
	};

	const disconnectCall = useCallback(() => {
		// this is a peerjs bug so we will transmit a message to the peer to disconnect instead of calling peer.disconnect()
		peerCallRef.current?.close();
		peerObjectRef.current?.destroy();
		peerObjectRef.current = undefined;
	}, []);

	React.useEffect(() => {
		const createPeer = async (username: string) => {
			// crypto.getRandomValues(new Uint32Array(1))[0]
			const peer = new Peer(`${username}-${uid}`, {
				secure: true,
				host: import.meta.env.VITE_PEERJS_HOST,
				port: 443,
				path: '/peerjs',
				debug: DEVELOPMENT ? 3 : 0,
			});
			return peer;
		};

		if (isSuccess && meetingData !== null && loggedInUser) {
			createPeer(loggedInUser.username as string).then((peer) => {
				peer.on('open', () => {
					peerObjectRef.current = peer;
				});
				peer.on('connection', (conn) => {
					conn.on('data', (data) => {
						console.log(data);
						peerDataRef.current = conn;
					});
					conn.on('close', () => {
						setPeerConnected(false);
						disconnectCall();
					});
				});
				peer.on('call', (call) => {
					setPeerConnected(true);
					navigator.mediaDevices
						.getUserMedia({ video: true, audio: true })
						.then((stream) => {
							call.answer(stream);
							call.on('stream', (remoteStream) => {
								const remoteVideo = remoteVideoRef.current;
								if (remoteVideo) {
									remoteVideo.srcObject = remoteStream;
									peerCallRef.current = call;
									remoteVideo.play();
								}
							});
						});
				});
				peer.on('error', () => {
					peer.destroy();
					createPeer(loggedInUser.username as string);
				});
			});
		}
	}, [disconnectCall, isSuccess, loggedInUser, meetingData, uid]);

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
					<div className="rounded-md border-[1px] border-neutral-800 p-4 text-center font-mono">
						<p className="font-sans text-xl">{meeting.name}</p>
						<div className="mt-2">
							<p className="text-sm text-neutral-500">
								{convertTimeZone(meeting.time, time)}
							</p>
							<p className="text-sm text-neutral-500">{meeting.invites.join(', ')}</p>
							{peerConnected ? 'Connected' : 'Not Connected'}
						</div>
					</div>
				</div>

				{peerConnected ? (
					<div className="h-full w-full items-center justify-center sm:flex">
						<div className="items-center justify-center lg:ml-2 lg:flex lg:w-1/2 lg:flex-col">
							<div className="mt-5 flex h-full w-full items-center justify-center lg:flex-col">
								<video id="remote-video" ref={remoteVideoRef} autoPlay />
							</div>
							<div className="flex justify-center p-2">
								<PrimaryButton
									onClick={() => {
										setPeerConnected(false);
										peerDataRef.current?.close();
										disconnectCall();
									}}
								>
									Disconnect
								</PrimaryButton>
							</div>
						</div>
					</div>
				) : (
					<div className="text-center font-mono">
						<div className="mt-5">
							<PrimaryButton
								onClick={() => {
									if (peerObjectRef.current) {
										callPeer();
									}
								}}
							>
								Connect
							</PrimaryButton>
						</div>
						<div className="mt-5">
							{peerObjectRef.current?.on ? (
								<p className="font-sans text-sm">
									Your Peer ID is {peerObjectRef.current.id}
								</p>
							) : (
								'Refresh the page to get your peer ID'
							)}
						</div>
					</div>
				)}
			</div>
		);
	}

	return <div>Meeting not found</div>;
}
