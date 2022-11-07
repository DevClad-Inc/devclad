import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import { del } from 'idb-keyval';
import { invalidateAndStoreIDB } from '@/context/User.context';
import { updateUser } from '@/services/auth.services';
import { IUpdateUserForm } from '@/lib/types.lib';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { Success, Error } from '@/components/Feedback';
import { ProfileLoading } from '../LoadingStates';
import { useAuth } from '@/services/useAuth.services';

// only first name, last name, and username can be updated via this form
export default function UpdateUserForm(): JSX.Element {
	const qc = useQueryClient();
	const { token, loggedInUser } = useAuth();

	const validate = (values: IUpdateUserForm) => {
		const errors: IUpdateUserForm['errors'] = {};
		if (!values.firstName) {
			errors.firstName = 'Required';
		}
		if (!values.lastName) {
			errors.lastName = 'Required';
		}
		if (!values.username) {
			errors.username = 'Required';
		}
		return errors;
	};
	const handleSubmit = async (
		values: IUpdateUserForm,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		try {
			setSubmitting(true);
			const { firstName, lastName } = values;
			let { username } = values;
			if (username === loggedInUser.username) {
				username = undefined;
			}
			await updateUser(token, firstName, lastName, username)?.then(() => {
				del('loggedInUser');
				if (username === undefined) {
					username = loggedInUser.username;
				}
				setSubmitting(false);
				invalidateAndStoreIDB(qc, 'user');
				toast.custom(<Success success="User updated successfully" />, {
					id: 'user-update-success',
				});
			});
		} catch (error: any) {
			const { data } = error.response;
			if (data.username) {
				toast.custom(<Error error={data.username} />, {
					id: 'user-update-username-error',
				});
			} else {
				toast.custom(<Error error="Check First and Last Name" />, {
					id: 'user-update-name-error',
				});
			}
			setSubmitting(false);
		}
	};
	if (qc.getQueryState(['user'])?.status === 'loading') {
		return <ProfileLoading />;
	}
	return (
		<Formik
			initialValues={{
				firstName: loggedInUser && loggedInUser.first_name,
				lastName: loggedInUser && loggedInUser.last_name,
				username: loggedInUser && loggedInUser.username,
			}}
			validate={validate}
			onSubmit={(values, { setSubmitting }) => {
				handleSubmit(values, { setSubmitting });
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="firstName"
								className="text-md block
                 text-neutral-700 dark:text-neutral-300"
							>
								First Name
								<Field
									type="text"
									name="firstName"
									id="firstName"
									autoComplete="given-name"
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								<ErrorMessage
									name="firstName"
									component="div"
									className="text-bloodRed dark:text-mistyRose text-sm"
								/>
							</label>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="lastName"
								className="text-md block
                 text-neutral-700 dark:text-neutral-300"
							>
								Last Name
								<Field
									type="text"
									name="lastName"
									id="lastName"
									placeholder="Last Name"
									autoComplete="family-name"
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								<ErrorMessage
									name="lastName"
									component="div"
									className="text-bloodRed dark:text-mistyRose text-sm"
								/>
							</label>
						</div>
						<div className="col-span-6 sm:col-span-4">
							<label
								htmlFor="username"
								className="text-md block  text-neutral-700 dark:text-neutral-300"
							>
								Username
								<Field
									type="text"
									name="username"
									id="username"
									placeholder="username"
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                    border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
								/>
								<ErrorMessage
									name="username"
									component="div"
									className="text-bloodRed dark:text-mistyRose text-sm"
								/>
							</label>
						</div>
					</div>
					<div className="px-4 py-3 text-right sm:px-6">
						<PrimaryButton isSubmitting={isSubmitting}>
							<span className="text-sm">Save</span>
						</PrimaryButton>
					</div>
				</Form>
			)}
		</Formik>
	);
}
