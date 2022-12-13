import React from 'react';
import toast from 'react-hot-toast';
import axios, { AxiosResponse } from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAdmin, useAuth } from '@/services/useAuth.services';
import { usersQuery } from '@/services/internal.services';
import { Error } from '@/components/Feedback';
import { EmailType } from '../stream/types';
import { PrimaryButton } from '@/lib/Buttons.lib';

export default function Internal() {
	const { admin } = useAdmin();
	const { token } = useAuth();
	const [queryParams] = useSearchParams();

	let uQ: {
		queryKey: string[];
		queryFn: () => Promise<AxiosResponse<any, any> | null>;
		enabled: boolean;
	};
	if (queryParams.get('status') !== null) {
		uQ = usersQuery(token, queryParams.get('status') as string);
	} else {
		uQ = usersQuery(token);
	}

	const { data, isLoading, isSuccess } = useQuery({ ...uQ });

	const reminderURL = '/api/email/reminder/';
	const approvedURL = '/api/email/approved/';

	const handleMail = async (
		firstName: string,
		email: string,
		type: EmailType,
		id?: number,
		approved?: string
	) => {
		let url;
		let body;
		if (type === 'reminder') {
			url = reminderURL;
			body = {
				firstName,
				email,
			};
		} else {
			url = approvedURL;
			body = {
				firstName,
				email,
				id,
				approved,
			};
		}
		try {
			await axios.post(url, body);
		} catch {
			toast.custom(<Error error="Error sending emails" />);
		}
	};

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
			<ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
				{data.data.users.map((user: ManagedUser) => (
					<li
						key={user.id}
						className="bg-darkBG2 col-span-1 divide-y divide-neutral-800 rounded-md border-[1px] border-neutral-800 shadow-2xl shadow-white/5"
					>
						<div className="flex w-full items-center justify-between space-x-6 p-6">
							<div className="flex-1 truncate">
								<div className="flex items-center space-x-3">
									<h3 className="truncate text-sm font-medium text-neutral-100">
										{user.first_name}
									</h3>
									<span className="bg-phthaloGreen text-honeyDew inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
										{user.username}
									</span>
									<span className="text-honeyDew inline-block flex-shrink-0 rounded-full bg-cyan-800 px-2 py-0.5 text-xs font-medium">
										<Link to={`/profile/${user.username}`}> View Profile</Link>
									</span>
								</div>

								<p className="mt-1 truncate text-sm text-neutral-500">
									{user.email}
								</p>
							</div>
						</div>
						<div>
							{user.email && (
								<div className="-mt-px flex divide-x divide-neutral-800">
									<div className="flex w-0 flex-1">
										<button
											type="button"
											onClick={() => {
												handleMail(user.first_name, user.email, 'reminder');
											}}
											className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-md border border-transparent py-4 text-sm font-medium text-neutral-300 hover:text-neutral-100"
										>
											<ClockIcon className="h-5 w-5" aria-hidden="true" />
											<span className="ml-3">Remind</span>
										</button>
									</div>

									<div className="-ml-px flex w-0 flex-1">
										<PrimaryButton
											onClick={() => {
												handleMail(
													user.first_name,
													user.email,
													'approved',
													user.id,
													'True'
												);
											}}
											className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-md border border-transparent py-4 text-sm font-medium text-neutral-300 hover:text-neutral-100"
										>
											<CheckCircleIcon
												className="h-5 w-5"
												aria-hidden="true"
											/>
											<span className="ml-3">Approve</span>
										</PrimaryButton>
									</div>
								</div>
							)}
						</div>
					</li>
				))}
			</ul>
		);
	}
	return <div>Internal not found</div>;
}
