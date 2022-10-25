/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { EnvelopeIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { convertTimeZone } from '@devclad/lib';
import { meetingQuery } from '@/lib/queriesAndLoaders';
import { Meeting, SocialProfile } from '@/lib/InterfacesStates.lib';
import { useAuth } from '@/services/useAuth.services';
import { useSocialProfile } from '@/services/socialHooks.services';

export function MeetingList(): JSX.Element {
	const qc = useQueryClient();
	const { token } = useAuth();
	const socialProfile = useSocialProfile() as SocialProfile;
	const spState = qc.getQueryState(['social-profile']);

	const { data: meetingData, isLoading, isSuccess } = useQuery({ ...meetingQuery(token, 'all') });
	if (
		isLoading ||
		spState?.status === 'loading' ||
		spState?.status !== 'success' ||
		socialProfile === null
	) {
		return <div>Loading...</div>;
	}
	/*
	- invites
	- link
	- time (start)
	- time (end) (15 min)
	- description (auto-generated)
	 */

	if (isSuccess && meetingData !== null) {
		const { meetings } = meetingData.data as { meetings: Meeting[] };
		return (
			<div>
				<h1 className="text-2xl font-bold">Meetings</h1>
				<ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{meetings.map((meeting) => (
						<li
							key={meeting.id}
							className="bg-darkBG2 col-span-1 divide-y divide-neutral-800 rounded-lg border-[1px] border-neutral-800 shadow"
						>
							<div className="flex w-full items-center justify-between space-x-6 p-6">
								<div className="flex-1 truncate">
									<div className="flex items-center space-x-3">
										<h3 className="truncate text-sm font-medium text-neutral-100">
											{meeting.name}
										</h3>
										<span className="bg-phthaloGreen text-honeyDew inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
											{meeting.type_of}
										</span>
									</div>
									<p className="mt-1 truncate text-sm text-neutral-500">
										{
											convertTimeZone(
												meeting.time,
												socialProfile?.timezone as string
											) // convert to local time
										}
									</p>
								</div>
								{/* <img
									className="bg-linen h-32 w-32 rounded-full object-cover sm:h-24 sm:w-24"
									src={
										import.meta.env.VITE_DEVELOPMENT
											? import.meta.env.VITE_API_URL +
											  useProfileImage(meeting.invites[0])
											: useProfileImage(meeting.invites[0])
									}
									alt=""
								/> */}
							</div>
							<div>
								<div className="-mt-px flex divide-x divide-neutral-800">
									<div className="flex w-0 flex-1">
										<a
											href={`mailto:${meeting.name}`}
											className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-neutral-300 hover:text-neutral-100"
										>
											<EnvelopeIcon
												className="h-5 w-5 text-neutral-600"
												aria-hidden="true"
											/>
											<span className="ml-3">Email</span>
										</a>
									</div>
									<div className="-ml-px flex w-0 flex-1">
										<Link
											to={`/meetings/${meeting.uid}`}
											className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-neutral-300 hover:text-neutral-100"
										>
											<VideoCameraIcon
												className="h-5 w-5 text-neutral-600"
												aria-hidden="true"
											/>
											<span className="ml-3">Join Room</span>
										</Link>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return <div>Meeting not found</div>;
}

export function MeetingDetail({ uid }: { uid: string | null }): JSX.Element {
	const { token } = useAuth();
	const {
		data: meetingData,
		isLoading,
		isSuccess,
	} = useQuery({
		...meetingQuery(token, uid as string),
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isSuccess && meetingData !== null) {
		const { meetings: meeting } = meetingData.data as { meetings: Meeting };
		return (
			<div>
				<h1>Meeting</h1>
				<div key={meeting.id}>
					<h2>{meeting.name}</h2>
					<p>{meeting.invites}</p>
				</div>
			</div>
		);
	}

	return <div>Meeting not found</div>;
}

export default function Meetings(): JSX.Element {
	const { uid } = useParams<{ uid: string }>() as { uid: string };

	if (!uid) {
		return <MeetingList />;
	}
	return <MeetingDetail uid={uid} />;
}
