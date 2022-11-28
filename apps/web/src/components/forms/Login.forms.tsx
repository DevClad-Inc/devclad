import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { delMany } from 'idb-keyval';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { z, ZodError } from 'zod';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { CF_KEY, DEVELOPMENT, getUser, logIn } from '@/services/auth.services';
import { invalidateAndStoreIDB } from '@/context/User.context';
import { LoadingSpinner } from '@/lib/Buttons.lib';
import { ILoginForm } from '@/lib/types.lib';

interface LoginFormProps {
	loginError: boolean;
	setLoginError: (loginError: boolean) => void;
}

export default function LoginForm({ loginError, setLoginError }: LoginFormProps): JSX.Element {
	const qc = useQueryClient();
	const validate = (values: ILoginForm) => {
		const errors: ILoginForm['errors'] = {};
		const userSchema = z.object({
			email: z.string().email(),
			password: z.string(),
		});
		try {
			userSchema.parse(values);
		} catch (err) {
			if (err instanceof ZodError) {
				for (const error of err.errors) {
					const { path } = error;
					switch (path[0]) {
						case 'email':
							errors.email = error.message;
							break;
						case 'password':
							errors.password = error.message;
							break;
						default:
							break;
					}
				}
			}
		}
		return errors;
	};
	const handleSubmit = async (
		values: ILoginForm,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		try {
			setSubmitting(true);
			const { email, password } = values;
			const { token } = await logIn(qc, email, password);

			if (loginError) {
				setLoginError(false);
			}
			if (token) {
				// only exception to checkTokenType; type is checked in checkTokenType within getUser tho
				await getUser(token || '')
					.then(() => invalidateAndStoreIDB(qc, 'user'))
					.catch(() => delMany(['loggedInUser', 'profile']));
			}
		} catch (error) {
			setLoginError(true);
			setSubmitting(false);
		}
	};
	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			validate={validate}
			onSubmit={(values, { setSubmitting }) => {
				handleSubmit(values, { setSubmitting });
			}}
		>
			{({ isSubmitting }) => (
				<Form className="space-y-6" action="#" method="POST">
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
									placeholder="work@devclad.com"
									autoComplete="email"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								{loginError && (
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
							htmlFor="password"
							className="block pl-1 text-left text-sm
           text-neutral-700 dark:text-neutral-300"
						>
							Password
							<div className="relative mt-1">
								<Field
									id="password"
									name="password"
									type="password"
									placeholder="••••••••••••••••"
									autoComplete="current-password"
									required
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								{loginError && (
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<ExclamationTriangleIcon
											className="text-bloodRed dark:text-mistyRose h-5 w-5"
											aria-hidden="true"
										/>
									</div>
								)}
							</div>
							<ErrorMessage
								name="password"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
						</label>
					</div>

					<div className="inline-flex items-center">
						<div className="text-sm">
							<Link
								to="/forgot-password"
								className=" text-orange-700 dark:text-orange-200"
							>
								Forgot your password?
							</Link>
						</div>
					</div>
					{DEVELOPMENT ? (
						<div
							className="cf-turnstile"
							data-sitekey="1x00000000000000000000AA"
							data-theme="dark"
						/>
					) : (
						<div className="cf-turnstile" data-sitekey={CF_KEY} data-theme="dark" />
					)}

					<div className="flex w-full justify-center">
						<button
							disabled={isSubmitting}
							type="submit"
							className="bg-darkBG2 hover:bg-darkBG hover:border-mistyRose/30 hover:text-mistyRose/50 flex w-full items-center
			justify-between space-x-6 rounded-md border-[1px]  border-neutral-900 p-6 text-neutral-500
			 shadow-2xl shadow-white/5 focus:ring-red-900"
						>
							<div className="flex-1 truncate">
								<div className="flex items-center space-x-3">
									<h3 className="truncate text-sm text-neutral-500 sm:text-base">
										{isSubmitting ? 'Signing' : 'Sign'} In
									</h3>
								</div>
							</div>
							{isSubmitting ? (
								<LoadingSpinner />
							) : (
								<ArrowRightOnRectangleIcon
									className="h-6 w-6 flex-shrink-0 lg:h-8 lg:w-8"
									aria-hidden="true"
								/>
							)}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
}
