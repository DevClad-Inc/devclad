import React from 'react';
import { useAdmin } from '@/services/useAuth.services';

export default function Internal() {
	const { admin } = useAdmin();

	if (!admin) {
		return <div>Not authorized</div>;
	}
	return (
		<div>
			<h1>Internal</h1>
		</div>
	);
}
