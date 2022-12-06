import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAdmin, useAuth } from '@/services/useAuth.services';
import { usersQuery } from '@/services/internal.services';

export default function Internal() {
	const { admin } = useAdmin();
	const { token } = useAuth();
	const [queryParams] = useSearchParams();

	let uQ;

	if (queryParams.get('filter') !== null) {
		uQ = usersQuery(token, queryParams.get('filter') as string);
	} else {
		uQ = usersQuery(token);
	}

	const { data, isLoading, isSuccess } = useQuery({ ...uQ });

	const reminderURL = '/emails/reminder';
	const approvedURL = '/emails/approved';

	interface ManagedUser {
		id: number;
		email: string;
		first_name: string;
		last_name: string;
		username: string;
	}

	if (!admin) {
		return <div>Not authorized</div>;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isSuccess && data !== null) {
		return (
			<div>
				<h1>Internal</h1>
				{data.data.users.map((user: ManagedUser) => (
					<div key={user.id}>
						<h2>{user.username}</h2>
						<p>{user.email}</p>
						<p>{user.first_name}</p>
						<p>{user.last_name}</p>
					</div>
				))}
			</div>
		);
	}
	return <div>Internal not found</div>;
}
