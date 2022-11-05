import {
	ShieldExclamationIcon,
	ShieldCheckIcon,
	InboxArrowDownIcon,
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { changeEmail, checkTokenType, checkVerified, resendEmail } from '@/services/auth.services';
import { Error, Success, Warning } from '@/components/Feedback';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { InterfaceEmail } from '@/lib/InterfacesStates.lib';
import { ProfileLoading } from '../LoadingStates';
import { useAuth } from '@/services/useAuth.services';

export default function ChangeEmailForm(): JSX.Element {
	let verified = false;
	const qc = useQueryClient();
	const { token, loggedInUser } = useAuth();
	const verifiedQuery = useQuery(['verified'], () => checkVerified(token), {
		enabled: checkTokenType(token),
	});
	if (verifiedQuery.isSuccess && verifiedQuery.data !== null) {
		const { data } = verifiedQuery.data;
		verified = data.verified;
	}
	const [changedEmail, setchangedEmail] = useState(false);
	const validate = (values: InterfaceEmail) => {
		const errors: InterfaceEmail['errors'] = {};
		if (!values.email) {
			errors.email = 'Required';
		} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
			errors.email = 'Invalid email address';
		}
		return errors;
	};

	const handlePassChange = async (
		values: InterfaceEmail,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		setSubmitting(true);
		const { email } = values;
		await changeEmail(token, email)
			?.then(async () => {
				await qc.invalidateQueries(['user']);
				await qc.invalidateQueries(['verified']);
				toast.custom(<Success success="Verification Email Sent." />, {
					id: 'verification-mail-sent',
					duration: 3000,
				});
				setchangedEmail(true);
			})
			.catch(() => {
				toast.custom(<Error error="Email already exists." />, {
					id: 'error-email-change',
					duration: 5000,
				});
			});
		setSubmitting(false);
	};
	if (qc.getQueryState(['user'])?.status === 'loading' || verifiedQuery.isLoading) {
		return (
			<div className="flex items-center justify-center">
				<ProfileLoading />
			</div>
		);
	}
	return (
		<Formik
			initialValues={{
				email: '',
			}}
			validate={validate}
			onSubmit={(values, { setSubmitting }) => {
				handlePassChange(values, { setSubmitting });
			}}
		>
			{({ isSubmitting }) => (
				<>
					<div className="w-fit">
						{verified === true ? (
							<span className="dark:bg-phthaloGreen dark:text-honeyDew inline-flex rounded-md p-2 text-sm">
								{' '}
								<ShieldCheckIcon className="mr-2 h-6 w-5 text-green-500" />{' '}
								{loggedInUser.email} is verified.
							</span>
						) : (
							<>
								<Warning warning="Please verify your email. You will not be able to login with an unverified email." />
								<span className="dark:bg-bloodRed2 dark:text-mistyRose inline-flex rounded-md p-2 text-sm">
									{' '}
									<ShieldExclamationIcon className="text-bloodRed dark:text-mistyRose mr-2 h-6 w-5" />{' '}
									{loggedInUser.email} is unverified.
								</span>
							</>
						)}
					</div>
					<Form className="mt-5 sm:flex sm:items-center" action="#" method="POST">
						<div className="w-full sm:max-w-xs">
							<Field
								id="email"
								name="email"
								type="email"
								placeholder={
									loggedInUser.email ? loggedInUser.email : 'cactus@jack.com'
								}
								autoComplete="email"
								required
								className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500
                    dark:border-neutral-800 sm:text-sm"
							/>
							<ErrorMessage
								name="email"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
						</div>
						{!verified && changedEmail ? (
							<div className="flex justify-center">
								<button
									type="button"
									onClick={() =>
										loggedInUser.email && resendEmail(loggedInUser.email)
									}
								>
									<span
										className="dark:bg-darkBG inline-flex w-full items-center
                  justify-center rounded-md bg-orange-700 py-2 px-4 text-sm
                  text-white duration-500 dark:text-orange-200 sm:mt-0 sm:ml-3
                  sm:w-auto sm:text-sm"
									>
										<div className="flex">
											<div className="flex-shrink-0">
												<InboxArrowDownIcon
													className="h-5 w-5"
													aria-hidden="true"
												/>
											</div>
											<div className="ml-2 text-base font-bold">
												<span>Resend Email.</span>
											</div>
										</div>
									</span>
								</button>
							</div>
						) : (
							<div
								className="mt-3 inline-flex w-full items-center justify-center
                border border-transparent px-4 py-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							>
								<PrimaryButton isSubmitting={isSubmitting}>
									<span>
										{isSubmitting ? 'Updating Email...' : 'Update Email ✨'}
									</span>
								</PrimaryButton>
							</div>
						)}
					</Form>
				</>
			)}
		</Formik>
	);
}
