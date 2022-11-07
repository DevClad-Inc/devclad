import React from 'react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@devclad/lib';
import { logOut } from '@/services/auth.services';
import { LoadingSpinner, redString } from '@/lib/Buttons.lib';
import { useAuth } from '@/services/useAuth.services';

export function Home(): JSX.Element {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const { authed, loggedInUser } = useAuth();
	const [loggingOut, setLoggingOut] = React.useState(false);
	const handlelogOut = async () => {
		setLoggingOut(true);
		await logOut();
	};
	useDocumentTitle('Dashboard');
	React.useEffect(() => {
		if (!authed && qc.getQueryData(['user']) === null) {
			navigate('/');
		}
	}, [authed, qc, navigate]);
	return (
		<div className="mx-auto max-w-full  px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-lg">
				<h1 className="text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
					{loggedInUser && loggedInUser.first_name}
				</h1>
			</div>
			<br />
			<div className="mx-auto w-3/4 max-w-lg">
				<div className="text-center text-sm text-neutral-500">
					<button onClick={handlelogOut} type="button" className={redString}>
						{loggingOut ? (
							<>
								<LoadingSpinner /> Signing
							</>
						) : (
							<>
								<ArrowLeftOnRectangleIcon
									className="-ml-1 mr-2 h-5 w-5"
									aria-hidden="true"
								/>
								Sign
							</>
						)}
						{'  '}
						Out
					</button>
				</div>
			</div>
			<br />
		</div>
	);
}
