import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@devclad/lib';
import Cookies from 'js-cookie';
import { useAuth } from '@/services/useAuth.services';
import Layout from '@/pages/Layout';

export function FourOFour(): JSX.Element {
	const { authed } = useAuth();
	useDocumentTitle('Oops! 404');
	const navigate = useNavigate();
	const loggedInCookie = Cookies.get('loggedIn');

	React.useEffect(() => {
		if (!authed && !loggedInCookie) {
			navigate('/login');
		}
	}, [authed, loggedInCookie, navigate]);

	return (
		// todo: CHANGE THIS!!
		<div>
			<Layout>
				<div className="mx-auto max-w-full  px-4 py-16 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-lg">
						<h1 className="text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
							404
						</h1>
					</div>
				</div>
			</Layout>
		</div>
	);
}
