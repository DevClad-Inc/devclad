import React, { ChangeEvent, Fragment, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { toast } from 'react-hot-toast';
import { updateProfile, updateProfileAvatar } from '@/services/profile.services';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { Profile, UpdateProfileFormValues } from '@/lib/InterfacesStates.lib';
import { Error, Success } from '@/components/Feedback';
import { ThemeContext } from '@/context/Theme.context';
import { invalidateAndStoreIDB } from '@/context/User.context';
import { ProfileLoading } from '../LoadingStates';
import { useAuth } from '@/services/useAuth.services';
import { useProfile } from '@/services/socialHooks.services';

export default function UpdateProfileForm(): JSX.Element {
	const qc = useQueryClient();
	const { loggedInUser } = useAuth();
	const profileData = useProfile(loggedInUser.username as string) as Profile;
	const validate = (values: UpdateProfileFormValues) => {
		const errors: UpdateProfileFormValues['errors'] = {};
		// ABOUT
		if (!values.about) {
			errors.about = 'Required';
		}
		// WEBSITE
		if (
			values.website &&
			!(values.website.startsWith('http') || values.website.startsWith('https'))
		) {
			errors.website = 'Must start with http or https';
		}
		// LINKEDIN
		if (
			values.linkedin &&
			(!(values.linkedin.startsWith('http') || values.linkedin.startsWith('https')) ||
				!values.linkedin.includes('linkedin.com'))
		) {
			errors.linkedin = 'Must start with http or https and include linkedin.com';
		}
		// CALENDLY
		if (
			values.calendly &&
			(!(values.calendly.startsWith('http') || values.calendly.startsWith('https')) ||
				!values.calendly.includes('calendly.com'))
		) {
			errors.calendly = 'Must start with http or https and include calendly.com';
		}
		return errors;
	};
	const handleSubmit = async (
		values: UpdateProfileFormValues,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		setSubmitting(true);
		await updateProfile(values, profileData)
			?.then(() => {
				setSubmitting(false);
				invalidateAndStoreIDB(qc, 'profile');
				toast.custom(<Success success="Profile updated successfully" />, {
					id: 'profile-update-success',
				});
			})
			.catch((error: any) => {
				const { data } = error.response;
				if (data.calendly) {
					toast.custom(<Error error={data.calendly} />, { id: 'social-update-error' });
				} else {
					toast.custom(
						<Error error="Languages, Development Type, and What makes you want to use this should be filled." />,
						{ id: 'profile-update-error-unknown' }
					);
				}
				setSubmitting(false);
			});
	};

	if (profileData) {
		return (
			<Formik
				initialValues={{
					about: profileData.about,
					pronouns: profileData.pronouns,
					website: profileData.website,
					linkedin: profileData.linkedin,
					calendly: profileData.calendly,
				}}
				validate={validate}
				onSubmit={(values, { setSubmitting }) => {
					if (values !== null && profileData !== null) {
						handleSubmit(values, { setSubmitting });
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<div className="grid grid-cols-6 gap-6">
							<div className="col-span-6 sm:col-span-6">
								<label
									htmlFor="about"
									className="text-md block pl-1 text-left
           text-neutral-700 dark:text-neutral-300"
								>
									About
									<Field
										type="text"
										as="textarea"
										id="about"
										name="about"
										rows={3}
										className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
										placeholder="Currently, I'm ..."
									/>
									<ErrorMessage
										name="about"
										component="div"
										className="text-bloodRed dark:text-mistyRose text-sm"
									/>
									<p className="mt-2 text-sm text-neutral-500">
										Tip: Talk about what you like to build and what you are
										currently working on.
									</p>
								</label>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="pronouns"
									className="text-md block pl-1 text-left
           text-neutral-700 dark:text-neutral-300"
								>
									Pronouns
									<Field
										type="text"
										id="pronouns"
										name="pronouns"
										rows={3}
										className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
										placeholder=""
									/>
									<ErrorMessage
										name="pronouns"
										component="div"
										className="text-bloodRed dark:text-mistyRose text-sm"
									/>
								</label>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="linkedin"
									className="text-md block pl-1 text-left
           text-neutral-700 dark:text-neutral-300"
								>
									LinkedIn
									<Field
										type="text"
										id="linkedin"
										name="linkedin"
										rows={3}
										className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
										placeholder="https://linkedin.com/..."
									/>
									<ErrorMessage
										name="linkedin"
										component="div"
										className="text-bloodRed dark:text-mistyRose text-sm"
									/>
								</label>
							</div>
							<div className="col-span-6 sm:col-span-3">
								<label
									htmlFor="website"
									className="text-md block pl-1 text-left
           text-neutral-700 dark:text-neutral-300"
								>
									Website
									<Field
										type="text"
										id="website"
										name="website"
										rows={3}
										className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
										placeholder="https://"
									/>
									<ErrorMessage
										name="website"
										component="div"
										className="text-bloodRed dark:text-mistyRose text-sm"
									/>
									<p className="mt-2 text-sm text-neutral-500">
										Tip: Showcase your best build yet if you do not have a
										website.
									</p>
								</label>
							</div>
							<div className="col-span-6 mb-10 sm:col-span-3">
								<label
									htmlFor="calendly"
									className="text-md block
               text-neutral-700 dark:text-neutral-300"
								>
									Calendly Link
									<Field
										type="text"
										name="calendly"
										id="calendly"
										placeholder="https://calendly.com/..."
										className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
									/>
									<ErrorMessage
										name="calendly"
										component="div"
										className="text-bloodRed dark:text-mistyRose text-sm"
									/>
									<p className="mt-2 text-sm text-neutral-500">
										Add a Calendly link for convenience if you need to.
									</p>
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
	return (
		<div className="flex items-center justify-center">
			<ProfileLoading />
		</div>
	);
}
const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
	event.preventDefault();
};

export function AvatarUploadForm() {
	const { darkMode } = useContext(ThemeContext);
	const qc = useQueryClient();
	const { loggedInUser } = useAuth();
	const profileData = useProfile(loggedInUser.username as string) as Profile;
	if (qc.getQueryState(['profile', loggedInUser.username as string])?.status === 'loading') {
		return <ProfileLoading />;
	}
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const { files } = event.dataTransfer;
		const file = files[0];
		if (file) {
			toast.loading('Uploading...', {
				style: {
					background: darkMode ? '#222435' : '#fff',
					color: darkMode ? '#f0abfc' : '#1f2937',
				},
			});
			updateProfileAvatar(file)
				?.then(() => {
					invalidateAndStoreIDB(qc, 'profile');
					toast.custom(<Success success="Profile avatar updated successfully!" />);
				})
				.catch(() => {
					toast.custom(
						<Error
							error="Please upload a valid image.
        And, keep it below 5MB."
						/>
					);
				});
		}
	};
	const handleonChange = (e: ChangeEvent<HTMLInputElement>) => {
		const avatar = e.target.files && e.target.files[0];
		if (avatar) {
			updateProfileAvatar(avatar)
				?.then(() => {
					invalidateAndStoreIDB(qc, 'profile');
					toast.custom(<Success success="Profile avatar updated successfully!" />);
				})
				.catch(() => {
					toast.custom(
						<Error error="Profile avatar update failed! Please upload a valid image." />
					);
				});
		}
	};

	return (
		<>
			<div className="col-span-3">
				<div className="mt-1 flex items-center">
					<img
						className="inline-block h-24 w-24 rounded-full bg-white object-cover"
						src={
							import.meta.env.VITE_DEVELOPMENT
								? import.meta.env.VITE_API_URL + profileData.avatar
								: profileData.avatar
						}
						alt=""
					/>
				</div>
			</div>
			<div className="col-span-3">
				<div
					className="mt-1 flex justify-center rounded-md border-2 border-dashed border-neutral-300 px-6 pt-5 pb-6"
					onDragOver={enableDropping}
					onDrop={handleDrop}
				>
					<div className="space-y-1 text-center">
						<svg
							className="mx-auto h-12 w-12 text-neutral-400"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 48 48"
							aria-hidden="true"
						>
							<path
								d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<div className="flex text-sm text-neutral-600">
							<label
								htmlFor="file-upload"
								className="relative cursor-pointer rounded-md
                text-orange-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500
                focus-within:ring-offset-2 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-400"
							>
								<span>Upload a file</span>
								<input
									id="file-upload"
									name="file-upload"
									type="file"
									onChange={handleonChange}
									accept="image/*"
									onDrop={handleDrop}
									className="sr-only"
								/>
							</label>
							<p className="dark:text-linen pl-1 text-black">or DRAG AND DROP</p>
						</div>
						<p className="text-xs text-neutral-700 dark:text-neutral-300">
							PNG, JPG, GIF, SVG up to 5MB
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
