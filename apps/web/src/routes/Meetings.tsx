import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { meetingQuery } from '@/lib/queriesAndLoaders';
import { Meeting } from '@/lib/InterfacesStates.lib';

export function MeetingList(): JSX.Element {
	const { data: meetingData, isLoading, isSuccess } = useQuery(meetingQuery('all'));
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isSuccess && meetingData != null) {
		const { meetings } = meetingData.data as { meetings: Meeting[] };
		return (
			<div>
				<h1>Meeting</h1>
				{meetings.map((meeting) => (
					<div key={meeting.id}>
						<h2>
							<Link to={`/meetings/${meeting.uid}`}>{meeting.name}</Link>
						</h2>
					</div>
				))}
			</div>
		);
	}

	return <div>Meeting not found</div>;
}

export function MeetingDetail({ uid }: { uid: string | null }): JSX.Element {
	const { data: meetingData, isLoading, isSuccess } = useQuery(meetingQuery(uid as string));

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isSuccess && meetingData != null) {
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
