import React from 'react';
import { useDocumentTitle } from '@devclad/lib';
import { useAuth } from '@/services/useAuth.services';

export default function Hackathons(): JSX.Element {
	useDocumentTitle('Hackathons');
	const { loggedInUser } = useAuth();
	return (
		<div>
			<p className="text-center">{loggedInUser && loggedInUser.first_name}</p>
		</div>
	);
}
