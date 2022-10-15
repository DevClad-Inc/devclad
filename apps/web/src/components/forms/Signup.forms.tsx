import { InboxArrowDownIcon, ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import { resendEmail, SignUp } from '@/services/auth.services';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { SignupFormValues } from '@/lib/InterfacesStates.lib';

interface SignupFormProps {
	signupErrorState: string;
	setSignupErrorState: (signupErrorState: string) => void;
}

export default function SignupForm({
	signupErrorState,
	setSignupErrorState,
}: SignupFormProps): JSX.Element {
	const [signedUp, setSignedUp] = useState(false);
	const [emailVal, setEmailVal] = useState('');
	const validate = (values: SignupFormValues) => {
		const errors: SignupFormValues['errors'] = {};
		if (!values.firstName) {
			errors.firstName = 'Required';
		}
		if (!values.lastName) {
			errors.lastName = 'Required';
		}
		if (!values.email) {
			errors.email = 'Required';
		} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
			errors.email = 'Invalid email address';
		}
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

	const handleSignUp = async (
		values: SignupFormValues,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		setSubmitting(true);
		const { firstName, lastName, email, password1, password2 } = values;
		const user = {
			firstName,
			lastName,
			email,
			password1,
			password2,
		};
		await SignUp(user).then((resp) => {
			if (resp.status === 201) {
				setEmailVal(email);
				if (signupErrorState) {
					setSignupErrorState('');
				}
				setSignedUp(true);
			} else if (resp.response.status === 400) {
				setSubmitting(false);
				const { data } = resp.response;
				if (data.email) {
					setSignupErrorState(data.email.toString());
				} else if (data.non_field_errors) {
					setSignupErrorState(data.non_field_errors.toString());
				} else if (data.password1) {
					setSignupErrorState(data.password1.toString());
				} else if (data.password2) {
					setSignupErrorState(data.password2.toString());
				}
			} else if (resp.response.status === 500) {
				setSignedUp(false);
				setSubmitting(false);
				setSignupErrorState('Server error. Please try again later.');
			} else if (resp.response.status === 429) {
				setSignedUp(false);
				setSubmitting(false);
				setSignupErrorState('Too many requests. Please try again in 24 hours.');
			}
		});
	};
	return (
		<Formik
			initialValues={{
				firstName: '',
				lastName: '',
				email: '',
				password1: '',
				password2: '',
			}}
			validate={validate}
			onSubmit={(values, { setSubmitting }) => {
				handleSignUp(values, { setSubmitting });
			}}
		>
			{({ isSubmitting }) => (
				<Form className="space-y-6" action="#" method="POST">
					<div>
						<label
							htmlFor="firstName"
							className="block pl-1 text-left text-sm
             text-neutral-700 dark:text-neutral-300"
						>
							First Name
							<div className="relative mt-1">
								<Field
									id="firstName"
									name="firstName"
									type="text"
									placeholder="Ye"
									autoComplete="First Name"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								{signupErrorState && (
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<ExclamationTriangleIcon
											className="text-bloodRed dark:text-mistyRose h-5 w-5"
											aria-hidden="true"
										/>
									</div>
								)}
							</div>
							<ErrorMessage
								name="firstName"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
						</label>
					</div>
					<div>
						<label
							htmlFor="lastName"
							className="block pl-1 text-left text-sm
               text-neutral-700 dark:text-neutral-300"
						>
							Last Name
							<div className="relative mt-1">
								<Field
									id="lastName"
									name="lastName"
									type="lastName"
									placeholder="West"
									autoComplete="Last Name"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								{signupErrorState && (
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<ExclamationTriangleIcon
											className="text-bloodRed dark:text-mistyRose h-5 w-5"
											aria-hidden="true"
										/>
									</div>
								)}
							</div>
							<ErrorMessage
								name="lastName"
								component="div"
								className="dark:text-mistyRose0 text-bloodRed text-sm"
							/>
						</label>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block pl-1 text-left text-sm
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
								{signupErrorState && (
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<ExclamationTriangleIcon
											className="text-bloodRed dark:text-mistyRose h-5 w-5"
											aria-hidden="true"
										/>
									</div>
								)}
							</div>
							<ErrorMessage
								name="email"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
						</label>
					</div>
					<div>
						<label
							htmlFor="password1"
							className="block pl-1 text-left text-sm
               text-neutral-700 dark:text-neutral-300"
						>
							Password
							<div className="relative mt-1">
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
								{signupErrorState && (
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<ExclamationTriangleIcon
											className="text-bloodRed dark:text-mistyRose h-5 w-5"
											aria-hidden="true"
										/>
									</div>
								)}
							</div>
							<ErrorMessage
								name="password1"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
						</label>
						<p
							className="mt-2 pl-2 text-sm text-neutral-600 dark:text-neutral-400"
							id="password-description"
						>
							At least 8 characters.
						</p>
						<p
							className="mt-2 pl-2 text-xs text-neutral-600 dark:text-neutral-400"
							id="password-description"
						>
							Tip: Autogenerate a password.
						</p>
					</div>
					<div>
						<label
							htmlFor="password2"
							className="block pl-1 text-left text-sm
               text-neutral-700 dark:text-neutral-300"
						>
							Confirm Password
							<div className="relative mt-1">
								<Field
									id="password2"
									name="password2"
									type="password"
									placeholder="••••••••••••••••"
									autoComplete="current-password"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								{signupErrorState && (
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<ExclamationTriangleIcon
											className="text-bloodRed dark:text-mistyRose h-5 w-5"
											aria-hidden="true"
										/>
									</div>
								)}
							</div>
							<ErrorMessage
								name="password2"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
						</label>
					</div>

					<div>
						{!signedUp ? (
							<div className="flex justify-center">
								<PrimaryButton isSubmitting={isSubmitting} wFull>
									<span className="text-lg font-bold">
										{isSubmitting ? 'Signing up...' : 'Sign Up'}{' '}
										<span className="text-xs">✨</span>
									</span>
								</PrimaryButton>
							</div>
						) : (
							<button type="button" onClick={() => resendEmail(emailVal)}>
								<span
									className="flex w-full justify-center rounded-md border border-transparent bg-green-50 py-2 px-4
                    text-sm  text-green-800 shadow-md hover:shadow-lg hover:shadow-green-300
                    focus:outline-none
                    focus:ring-2 focus:ring-green-200 focus:ring-offset-2"
								>
									<div className="flex">
										<div className="flex-shrink-0">
											<CheckIcon
												className="h-5 w-5 text-green-400"
												aria-hidden="true"
											/>
										</div>
										<div className="ml-2 text-base font-bold">
											<span>Account Created.</span> <span>Check Email.</span>
										</div>
									</div>
								</span>
								<span
									className="dark:bg-darkBG mt-5 inline-flex justify-center
                    rounded-md border border-transparent bg-orange-700 py-2
                    px-4 text-sm font-bold duration-500 dark:text-orange-300"
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
						)}
					</div>
				</Form>
			)}
		</Formik>
	);
}
