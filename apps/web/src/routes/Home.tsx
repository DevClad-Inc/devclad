import React from 'react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@devclad/lib';
import { logOut } from '@/services/auth.services';
import { redString } from '@/lib/Buttons.lib';
import { useAuth } from '@/services/useAuth.services';

function LoadingSpinnerVercel() {
	return (
		<svg
			className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	);
}

function Home(): JSX.Element {
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
			navigate('/login');
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
								<LoadingSpinnerVercel /> Signing
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

export default Home;
