/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { VideoCameraIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { convertTimeZone } from '@devclad/lib';
import { meetingQuery } from '@/lib/queriesAndLoaders';
import { Meeting, SocialProfile } from '@/lib/InterfacesStates.lib';
import { useAuth } from '@/services/useAuth.services';
import { useProfile, useSocialProfile } from '@/services/socialHooks.services';
import { API_URL, DEVELOPMENT } from '@/services/auth.services';

export const useMeetingImage = (meeting: Meeting): string => {
	const { loggedInUser } = useAuth();
	const loggedInUsername = loggedInUser?.username;
	const meetingInvite = meeting.invites.find((invite) => invite !== loggedInUsername);
	const avatar = useProfile(meetingInvite as string)?.avatar;
	return avatar || '';
};

export function MeetingCard({ meeting, time }: { meeting: Meeting; time: string }): JSX.Element {
	const avatar = useMeetingImage(meeting);
	return (
		<li
			key={meeting.id}
			className="bg-darkBG2 col-span-1 divide-y divide-neutral-800 rounded-md border-[1px] border-neutral-800 shadow-2xl shadow-white/5"
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
						{convertTimeZone(meeting.time, time)}
					</p>
					<p className="mt-1 truncate text-sm text-neutral-500">
						{meeting.invites.map((invite) => invite).join(', ')}
					</p>
				</div>
				<img
					className="bg-linen h-32 w-32 rounded-full object-cover sm:h-24 sm:w-24"
					src={DEVELOPMENT ? API_URL + avatar : avatar}
					alt=""
				/>
			</div>
			<div>
				{/* todo: add reschedule request modal */}
				<div className="-mt-px flex divide-x divide-neutral-800">
					<div className="flex w-0 flex-1">
						<a
							href={`mailto:${meeting.name}`}
							className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-md border border-transparent py-4 text-sm font-medium text-neutral-300 hover:text-neutral-100"
						>
							<CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
							<span className="ml-3">Reschedule</span>
						</a>
					</div>
					<div className="-ml-px flex w-0 flex-1">
						<Link
							to={`/meetings/${meeting.uid}`}
							className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-md border border-transparent py-4 text-sm font-medium text-neutral-300 hover:text-neutral-100"
						>
							<VideoCameraIcon className="h-5 w-5" aria-hidden="true" />
							<span className="ml-3">Join Room</span>
						</Link>
					</div>
				</div>
			</div>
		</li>
	);
}

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
	if (isSuccess && meetingData !== null) {
		const { meetings } = meetingData.data as { meetings: Meeting[] };
		const time = socialProfile?.timezone as string;
		return (
			<div>
				<h1 className="text-2xl font-bold">Meetings</h1>
				<ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{meetings.map((meeting) => (
						<MeetingCard meeting={meeting} time={time} />
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
