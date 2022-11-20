import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Outlet } from 'react-router-dom';
import { VideoCameraIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { convertTimeZone, useDocumentTitle } from '@devclad/lib';
import { useAuth } from '@/services/useAuth.services';
import { useProfile, useSocialProfile } from '@/services/socialHooks.services';
import { API_URL, DEVELOPMENT } from '@/services/auth.services';
import { meetingQuery } from '@/lib/queries.lib';
import { Meeting } from '@/app/stream/types';
import { SocialProfile } from '@/app/social/types';
import { Tab } from '@/components/Tabs';

export const useMeetingImage = (meeting: Meeting): string => {
	const { loggedInUser } = useAuth();
	const loggedInUsername = loggedInUser?.username;
	const meetingInvite = meeting.invites.find((invite) => invite !== loggedInUsername);
	const avatar = useProfile(meetingInvite as string)?.avatar;
	return avatar || '';
};

export function MeetingCard({ meeting, time }: { meeting: Meeting; time: string }): JSX.Element {
	const avatar = useMeetingImage(meeting);
	const isPast = new Date(meeting.time).getTime() < new Date().getTime();
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
					src={DEVELOPMENT ? `${API_URL}${avatar}` : avatar}
					alt=""
				/>
			</div>
			<div>
				{/* todo: add reschedule request modal */}
				{!isPast && (
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
							{/* Link to meeting room */}
							<Link
								to={`/meetings/${meeting.uid}`}
								className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-md border border-transparent py-4 text-sm font-medium text-neutral-300 hover:text-neutral-100"
							>
								<VideoCameraIcon className="h-5 w-5" aria-hidden="true" />
								<span className="ml-3">Join Room</span>
							</Link>
						</div>
					</div>
				)}
			</div>
		</li>
	);
}

export function MeetingList({ past }: { past?: boolean }): JSX.Element {
	const qc = useQueryClient();
	const { token } = useAuth();
	const socialProfile = useSocialProfile() as SocialProfile;
	const spState = qc.getQueryState(['social-profile']);
	const mQ = past ? meetingQuery(token, 'past') : meetingQuery(token, 'upcoming');

	const { data: meetingData, isLoading, isSuccess } = useQuery({ ...mQ });
	if (
		isLoading ||
		spState?.status === 'loading' ||
		spState?.status !== 'success' ||
		!socialProfile
	) {
		return <div>Loading...</div>;
	}
	if (isSuccess && meetingData !== null) {
		const { meetings } = meetingData.data as { meetings: Meeting[] };
		const time = socialProfile?.timezone as string;
		return (
			<ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{meetings.map((meeting) => (
					<MeetingCard meeting={meeting} time={time} key={meeting.id} />
				))}
			</ul>
		);
	}

	return <div>Meeting not found</div>;
}

MeetingList.defaultProps = {
	past: false,
};

export function Meetings(): JSX.Element {
	useDocumentTitle('Meetings');
	const qc = useQueryClient();
	const { token } = useAuth();
	return (
		<>
			<Tab
				tabs={[
					{
						name: 'Meetings',
						href: '/meetings',
						onmouseenter() {
							qc.prefetchQuery(meetingQuery(token, 'upcoming'));
						},
					},
					{
						name: 'Past Meetings',
						href: '/meetings/past',
						onmouseenter() {
							qc.prefetchQuery(meetingQuery(token, 'past'));
						},
					},
				]}
			/>
			<Outlet />
		</>
	);
}
