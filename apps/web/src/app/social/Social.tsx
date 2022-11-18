import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDocumentTitle } from '@devclad/lib';
import { useQueryClient } from '@tanstack/react-query';
import { Tab } from '@/components/Tabs';
import { useAuth } from '@/services/useAuth.services';
import { userCircleQuery, userMatchesQuery } from '@/lib/queries.lib';

export function Social(): JSX.Element {
	useDocumentTitle('Social Mode');
	const { loggedInUser, token } = useAuth();
	const qc = useQueryClient();
	const tabs = [
		{
			name: '1-on-1',
			href: '/social',
			onmouseenter: () => {
				qc.prefetchQuery(userMatchesQuery(token));
			},
		},
		{
			name: 'Circle',
			href: '/social/circle',
			onmouseenter: () => {
				qc.prefetchQuery(userCircleQuery(token, loggedInUser?.username || ''));
			},
		},
	];
	return (
		<>
			<Tab tabs={tabs} />
			<span className="hidden"> {loggedInUser.username} </span>
			<Outlet />
		</>
	);
}
