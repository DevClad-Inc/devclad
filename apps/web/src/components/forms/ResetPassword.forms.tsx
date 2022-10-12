import { ShieldCheckIcon, CheckIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDocumentTitle } from '@devclad/lib';
import { forgotPassword, passwordChange, passwordReset } from '@/services/auth.services';
import { Error, Success, Warning } from '@/components/Feedback';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { InterfaceEmail, PasswordReset } from '@/lib/InterfacesStates.lib';

export default function PasswordResetForm(): JSX.Element {
	const [resetDone, setresetDone] = useState(false);
	const { uid, token } = useParams() as { uid: string; token: string };
	const validate = (values: PasswordReset) => {
		const errors: PasswordReset['errors'] = {};
		if (!values.password1) {
			errors.password1 = 'Required';
		}
		if (!values.password2) {
			errors.password2 = 'Required';
		}
		if (values.password1.length < 8) {
			errors.password1 = 'Password must be at least 8 characters.';
		}
		if (values.password1 !== values.password2 && values.password2.length > 0) {
			errors.password1 = 'Passwords do not match';
			errors.password2 = 'Passwords do not match';
		}
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=[\S]+$)/;
		// /^[@#](?=.{7,13}$)(?=\w{7,13})(?=[^aeiou_]{7,13})(?=.*[A-Z])(?=.*\d)/;
		if (!passwordRegex.test(values.password1)) {
			errors.password1 =
				'Password must contain at least one number, one lowercase, one uppercase, and one special character.';
		}
		return errors;
	};

	const handlePassChange = async (
		values: PasswordReset,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		setSubmitting(true);
		const { password1, password2 } = values;
		if (uid && token) {
			await passwordReset(password1, password2, uid, token)
				.then(() => {
					toast.custom(<Success success="Password reset successful." />, {
						id: 'success-password-reset',
						duration: 3000,
					});
					setresetDone(true);
				})
				.catch((err) => {
					toast.custom(<Error error={err} />, { id: 'error-password-reset', duration: 5000 });
				});
		} else {
			await passwordChange(password1, password2)
				.then(() => {
					toast.custom(<Success success="Password change successful." />, {
						id: 'success-password-change',
						duration: 3000,
					});
					setresetDone(true);
				})
				.catch((err) => {
					toast.custom(<Error error={err} />, { id: 'error-password-change', duration: 5000 });
				});
		}
		setSubmitting(false);
	};
	return (
		<Formik
			initialValues={{
				password1: '',
				password2: '',
			}}
			validate={validate}
			onSubmit={(values, { setSubmitting }) => {
				handlePassChange(values, { setSubmitting });
			}}
		>
			{({ isSubmitting }) => (
				<Form className="space-y-6" action="#" method="POST">
					<div className="w-full">
						<Warning warning="This is a sensitive operation. Recommended: Save this password in a Cloud Keychain." />
					</div>
					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="password1"
								className="text-md block pl-1 text-left
           text-neutral-700 dark:text-neutral-300"
							>
								New Password
								<Field
									id="password1"
									name="password1"
									type="password"
									placeholder="••••••••••••••••"
									autoComplete="current-password"
									aria-describedby="password-description"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								<ErrorMessage
									name="password1"
									component="div"
									className="text-bloodRed dark:text-mistyRose text-sm"
								/>
								<p className="mt-2 text-sm text-neutral-500">
									At least 8 characters. Tip: Autogenerate a password.
								</p>
							</label>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="password2"
								className="text-md block pl-1 text-left
           text-neutral-700 dark:text-neutral-300"
							>
								Confirm Password
								<Field
									id="password2"
									name="password2"
									type="password"
									placeholder="••••••••••••••••"
									autoComplete="current-password"
									aria-describedby="password-description"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								<ErrorMessage
									name="password2"
									component="div"
									className="text-bloodRed dark:text-mistyRose text-sm"
								/>
							</label>
						</div>
					</div>
					<div>
						{!resetDone ? (
							<div className="flex justify-center text-sm">
								<PrimaryButton isSubmitting={isSubmitting}>
									<span>
										{isSubmitting ? 'Switching Password...' : 'Switch Password'} <span>🔐</span>
									</span>
								</PrimaryButton>
							</div>
						) : (
							<Link className="flex justify-center" to="/">
								<span
									className="dark:bg-darkBG mt-5 inline-flex justify-center
                    rounded-md border border-transparent bg-orange-700 py-2
                    px-4 text-sm duration-500 dark:text-orange-300"
								>
									<div className="flex">
										<div className="flex-shrink-0">
											<ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
										</div>
										<div className="ml-2 text-base font-bold">
											<span>Password Reset Successful</span>
										</div>
									</div>
								</span>
							</Link>
						)}
					</div>
				</Form>
			)}
		</Formik>
	);
}

export function ForgotPasswordForm(): JSX.Element {
	useDocumentTitle('Password Reset');
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
		await forgotPassword(email)
			.then((res) => {
				if (res.detail === 'Password reset e-mail has been sent.') {
					toast.custom(<Success success="Link Sent 🔗" />, {
						id: 'reset-link-sent',
						duration: 3000,
					});
					setchangedEmail(true);
				}
			})
			.catch((err) => {
				toast.custom(<Error error={err} />, { id: 'error-pass-link', duration: 5000 });
			});
		setSubmitting(false);
	};
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
				<Form className="space-y-6" action="#" method="POST">
					<Warning warning="Make sure to have access to your email. Reset link will be sent." />
					<div>
						<label
							htmlFor="email"
							className="text-md block pl-1 text-left
               text-neutral-700 dark:text-neutral-300"
						>
							Email
							<div className="relative mt-1">
								<Field
									id="email"
									name="email"
									type="email"
									placeholder="cactus@jack.com"
									autoComplete="email"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
							</div>
							<ErrorMessage
								name="email"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
						</label>
					</div>

					<div>
						{!changedEmail ? (
							<div className="flex justify-center">
								<PrimaryButton isSubmitting={isSubmitting}>
									<span className="text-md font-bold">
										{isSubmitting ? 'Sending Link...' : 'Send Link'}{' '}
										<span className="text-md">🔗</span>
									</span>
								</PrimaryButton>
							</div>
						) : (
							<div className="flex justify-center">
								<span
									className="dark:bg-darkBG mt-5 inline-flex justify-center
                    rounded-md border border-transparent bg-orange-700 py-2
                    px-4 text-sm font-bold duration-500 dark:text-orange-300"
								>
									<div className="flex">
										<div className="flex-shrink-0">
											<CheckIcon className="h-5 w-5" aria-hidden="true" />
										</div>
										<div className="ml-2 text-base font-bold">
											<span>Reset Link 🔗 Sent</span>
										</div>
									</div>
								</span>
							</div>
						)}
					</div>
				</Form>
			)}
		</Formik>
	);
}
