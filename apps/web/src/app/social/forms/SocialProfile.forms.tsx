/* eslint-disable no-param-reassign */
import React, { Fragment, useState } from 'react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { classNames } from '@devclad/lib';
import { SocialProfile, SocialProfileFormValues } from '@/app/social/types';
import { updateSocialProfile } from '@/services/profile.services';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { Success, Error } from '@/components/Feedback';
import Countries from '@/lib/list/Countries.list.json';
import Languages from '@/lib/list/Languages.list.json';
import Purposes from '@/lib/list/Purpose.list.json';

import { ProfileLoading } from '../../../components/LoadingStates';

import { useSocialProfile } from '@/services/socialHooks.services';
import { useAuth } from '@/services/useAuth.services';

export const devType = [
	{ name: 'AI', id: 0 },
	{ name: 'Blockchain', id: 1 },
	{ name: 'Game Development', id: 2 },
	{ name: 'Hardware', id: 3 },
	{ name: 'Mobile/Web', id: 4 },
	{ name: 'Native Desktop', id: 5 },
	{ name: 'Systems', id: 6 },
	{ name: 'Other', id: 7 },
];

const purposes = Purposes.map((purpose) => ({ purpose })) as {
	purpose: {
		name: string;
		id: number;
	};
}[];

const ideaStatus = [
	{ name: 'Open to exploring ideas.', id: 0 },
	{ name: 'Not open to exploring ideas.', id: 1 },
	{ name: 'Need people working on my idea.', id: 2 },
];

const countries = Countries.map((country) => ({ country })) as {
	country: {
		name: string;
		code: string;
	};
}[];

const languages = Languages.map((language) => ({ language })) as {
	language: {
		name: string;
		id: number;
	};
}[];

export function SocialProfileForm(): JSX.Element {
	const spData = useSocialProfile() as SocialProfile;
	const { token } = useAuth();

	// ============= FORM value states for multi-selects =============

	const [selectedIdeaStatus, setselectedIdeaStatus] = useState<{ name: string; id: number }>();
	const [selectedDevType, setselectedDevType] = useState<
		Array<{
			name: string;
			id: number;
		}>
	>([]);
	const [selectedPrefDevType, setselectedPrefDevType] = useState<{ name: string; id: number }>();
	const [selectedLanguages, setSelectedLanguages] = useState<Array<{ name: string; id: number }>>(
		[]
	);
	const [selectedPurposes, setSelectedPurposes] = useState<Array<{ name: string; id: number }>>(
		[]
	);
	const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string }>();
	let detected = Intl.DateTimeFormat().resolvedOptions().timeZone;

	// this is a hack to get the timezone to display correctly; FUCK YOU CHROMium
	if (detected === 'Asia/Calcutta') {
		detected = 'Asia/Kolkata';
	}
	const [profileTimezone, setProfileTimezone] = useState<string>(detected);

	// ============= FORM value states for multi-selects =============

	const qc = useQueryClient();
	const state = qc.getQueryState(['social-profile']);
	if (state?.status === 'loading' || state?.status !== 'success' || spData === null) {
		return <ProfileLoading />;
	}

	// ============= VALIDATE AND SUBMIT =============

	const throwToastError = (error: string) => {
		toast.custom(<Error error={error} />, {
			id: `${crypto.randomUUID()}-profile-update-error`,
		});
	};

	const validate = (values: SocialProfileFormValues) => {
		const errors: SocialProfileFormValues['errors'] = {};
		if (!values.raw_xp) {
			errors.raw_xp = 'Required';
		}
		if (values.raw_xp && (values.raw_xp > 50 || values.raw_xp < 0)) {
			errors.raw_xp = 'Must be between 0 and 50';
		}
		return errors;
	};
	const handleSubmit = async (
		values: SocialProfileFormValues,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		try {
			await qc.cancelQueries(['social-profile']);
			values.preferred_dev_type = selectedPrefDevType?.name;
			values.idea_status = selectedIdeaStatus?.name;
			values.location = selectedCountry?.name;
			values.dev_type = selectedDevType
				.map((type: { name: string; id: number }) => type.name)
				.sort()
				.join(', ');
			values.languages = selectedLanguages
				.map((language: { name: string; id: number }) => language.name)
				.sort()
				.join(', ');
			values.purpose = selectedPurposes
				.map((purpose: { name: string; id: number }) => purpose.name)
				.sort()
				.join(', ');
			setSubmitting(true);
			await updateSocialProfile(token, values, spData)?.then(async () => {
				setSubmitting(false);
				await qc.invalidateQueries();
				toast.custom(<Success success="Preferences updated successfully" />, {
					id: 'social-update-success',
				});
			});
		} catch (error: unknown) {
			const { response } = error as { response: { data: Partial<SocialProfile> } };
			const { data } = response;
			switch (true) {
				case data.timezone !== undefined:
					throwToastError(data.timezone as string);
					break;
				case data.location !== undefined:
					throwToastError(data.location as string);
					break;
				case data.preferred_dev_type !== undefined:
					throwToastError(data.preferred_dev_type as string);
					break;
				case data.idea_status !== undefined:
					throwToastError(data.idea_status as string);
					break;
				case data.dev_type !== undefined:
					throwToastError(data.dev_type as string);
					break;
				case data.languages !== undefined:
					throwToastError(data.languages as string);
					break;
				case data.purpose !== undefined:
					throwToastError(data.purpose as string);
					break;
				default:
					throwToastError('An unknown error occurred');
					break;
			}
			setSubmitting(false);
		}
	};

	// ============= VALIDATE AND SUBMIT =============

	return (
		<Formik
			initialValues={{
				timezone: detected,
				preferred_dev_type: spData.preferred_dev_type,
				idea_status: spData.idea_status,
				raw_xp: spData.raw_xp,
				purpose: spData.purpose,
				location: spData.location,
			}}
			validate={validate}
			onSubmit={(values, { setSubmitting }) => {
				handleSubmit(values, { setSubmitting });
			}}
		>
			{({ isSubmitting, setFieldValue }) => (
				<Form>
					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 sm:col-span-3">
							<label
								htmlFor="raw_xp"
								className="text-md block pl-1 text-left
           text-neutral-700 dark:text-neutral-300"
							>
								Raw Experience
								<Field
									type="number"
									id="raw_xp"
									name="raw_xp"
									rows={3}
									className="dark:bg-darkBG mt-1 block w-full rounded-md border
                  border-neutral-300 py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
									placeholder=""
								/>
								<ErrorMessage
									name="raw_xp"
									component="div"
									className="text-bloodRed dark:text-mistyRose text-sm"
								/>
								<p className="mt-2 text-sm text-neutral-500">
									Raw experience (years) building any piece of software/hardware.
								</p>
							</label>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<Listbox
								value={selectedIdeaStatus}
								onChange={(e: { name: string; id: number }) =>
									setselectedIdeaStatus(e)
								}
							>
								{({ open }) => (
									<>
										<Listbox.Label
											id="idea_status"
											className="text-md block
                    text-neutral-700 dark:text-neutral-300"
										>
											Idea Status
										</Listbox.Label>
										<div className="relative mt-1">
											<Listbox.Button
												className="dark:bg-darkBG relative w-full cursor-default
                      rounded-md border border-neutral-300 py-2 px-3 pl-3 pr-10
                      text-left shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
											>
												<span className="block truncate">
													{selectedIdeaStatus
														? selectedIdeaStatus.name
														: 'Select'}
												</span>
												<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
													<ChevronUpDownIcon
														className="h-5 w-5 text-neutral-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options
													className="scrollbar dark:bg-darkBG absolute z-10 mt-1 max-h-60 w-full overflow-auto
                        rounded-md py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
												>
													{ideaStatus.map((status) => (
														<Listbox.Option
															key={status.id}
															className={({ active }) =>
																classNames(
																	active
																		? 'bg-orange-200 text-black dark:bg-orange-200'
																		: 'bg-snow dark:bg-darkBG text-neutral-900 dark:text-neutral-100',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={status}
														>
															{({ active, selected }) => (
																<>
																	<span
																		className={classNames(
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{status.name}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-linen dark:text-darkBG'
																					: 'text-neutral-900 dark:text-neutral-100',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className="h-5 w-5"
																				aria-hidden="true"
																			/>
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
							<ErrorMessage
								name="idea_status"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
							{spData.idea_status && spData.idea_status.length > 0 && (
								<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
									Currently set to &#34;
									{spData.idea_status}
									&#34;.
								</p>
							)}
							<p className="mt-2 text-sm text-neutral-500">
								Your idea status. Tip: Be open to exploring!
							</p>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<Listbox
								value={selectedPrefDevType}
								// selectedDevType < 3 or selectedDevType should be already selected
								onChange={(e: { name: string; id: number }) => {
									setselectedPrefDevType(e);
								}}
							>
								{({ open }) => (
									<>
										<Listbox.Label
											id="preferredDevType"
											className="text-md block
                    text-neutral-700 dark:text-neutral-300"
										>
											Preferred Development Type
										</Listbox.Label>

										<div className="relative mt-1">
											<Listbox.Button
												className="dark:bg-darkBG relative w-full cursor-default
                      rounded-md border border-neutral-300 py-2 px-3 pl-3 pr-10
                      text-left shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
											>
												<span className="block truncate">
													{selectedPrefDevType
														? selectedPrefDevType.name
														: 'Select'}
												</span>
												<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
													<ChevronUpDownIcon
														className="h-5 w-5 text-neutral-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options
													className="scrollbar dark:bg-darkBG absolute z-10 mt-1 max-h-60 w-full overflow-auto
                        rounded-md py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
												>
													{devType.map((type) => (
														<Listbox.Option
															key={type.id}
															className={({ active }) =>
																classNames(
																	active
																		? 'bg-orange-200 text-black dark:bg-orange-200'
																		: 'bg-snow dark:bg-darkBG text-neutral-900 dark:text-neutral-100',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={type}
														>
															{({ active, selected }) => (
																<>
																	<span
																		className={classNames(
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{type.name}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-linen dark:text-darkBG'
																					: 'text-neutral-900 dark:text-neutral-100',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className="h-5 w-5"
																				aria-hidden="true"
																			/>
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
							<ErrorMessage
								name="preferredDevType"
								component="div"
								className="text-bloodRed dark:text-mistyRose text-sm"
							/>
							{spData.preferred_dev_type && spData.preferred_dev_type.length > 0 && (
								<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
									Currently set to &#34;
									{spData.preferred_dev_type}
									&#34;.
								</p>
							)}
							<p className="mt-2 text-sm text-neutral-500">
								Preferred Development Type of your 1-on-1 match.
							</p>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<Listbox
								value={selectedDevType}
								// selectedDevType < 3 or selectedDevType should be already selected
								onChange={(e: Array<{ name: string; id: number }>) => {
									if (e.length < 4) {
										if (e.length === 0) {
											setselectedDevType([]);
										} else if (e.length === 1) {
											setselectedDevType([e[0]]);
										} else {
											setselectedDevType(e);
										}
									}
								}}
								multiple
							>
								{({ open }) => (
									<>
										<Listbox.Label
											id="devType"
											className="text-md block
                    text-neutral-700 dark:text-neutral-300"
										>
											Development Type
										</Listbox.Label>

										<div className="relative mt-1">
											<Listbox.Button
												className="dark:bg-darkBG relative w-full cursor-default
                      rounded-md border border-neutral-300 py-2 px-3 pl-3 pr-10
                      text-left shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
											>
												<span className="block truncate">
													{selectedDevType[0]
														? selectedDevType
																.map(({ name }) => name)
																.join(', ')
														: 'Select'}
												</span>
												<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
													<ChevronUpDownIcon
														className="h-5 w-5 text-neutral-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options
													className="scrollbar dark:bg-darkBG absolute z-10 mt-1 max-h-60 w-full overflow-auto
                        rounded-md py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
												>
													{devType.map((type) => (
														<Listbox.Option
															key={type.id}
															className={({ active }) =>
																classNames(
																	active
																		? 'bg-orange-200 text-black dark:bg-orange-200'
																		: 'bg-snow dark:bg-darkBG text-neutral-900 dark:text-neutral-100',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={type}
														>
															{({ active, selected }) => (
																<>
																	<span
																		className={classNames(
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{type.name}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-linen dark:text-darkBG'
																					: 'text-neutral-900 dark:text-neutral-100',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className="h-5 w-5"
																				aria-hidden="true"
																			/>
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
							{spData.dev_type && spData.dev_type.length > 0 && (
								<p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
									Currently set to &#34;
									{spData.dev_type}
									&#34;.
								</p>
							)}
							<p className="mt-2 text-sm text-neutral-500">
								Choose up to 3 development types you are good at.
							</p>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<Listbox
								value={selectedLanguages}
								onChange={
									// check if selectedLanguages is empty or not
									(e: Array<{ name: string; id: number }>) => {
										if (e.length < 6) {
											if (e.length === 0) {
												setSelectedLanguages([]);
											} else if (e.length === 1) {
												setSelectedLanguages([e[0]]);
											} else {
												setSelectedLanguages(e);
											}
										}
									}
								}
								multiple
							>
								{({ open }) => (
									<>
										<Listbox.Label
											id="languages"
											className="text-md block
                    text-neutral-700 dark:text-neutral-300"
										>
											Languages
										</Listbox.Label>

										<div className="relative mt-1">
											<Listbox.Button
												className="dark:bg-darkBG relative w-full cursor-default
                      rounded-md border border-neutral-300 py-2 px-3 pl-3 pr-10
                      text-left shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
											>
												<span className="block truncate">
													{selectedLanguages[0]
														? selectedLanguages
																.map(({ name }) => name)
																.join(', ')
														: 'Select'}
												</span>
												<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
													<ChevronUpDownIcon
														className="h-5 w-5 text-neutral-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options
													className="scrollbar dark:bg-darkBG absolute z-10 mt-1 max-h-60 w-full overflow-auto
                        rounded-md py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
												>
													{languages.map(({ language }) => (
														<Listbox.Option
															key={language.id}
															className={({ active }) =>
																classNames(
																	active
																		? 'bg-orange-200 text-black dark:bg-orange-200'
																		: 'bg-snow dark:bg-darkBG text-neutral-900 dark:text-neutral-100',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={language}
														>
															{({ active, selected }) => (
																<>
																	<span
																		className={classNames(
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{language.name}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-linen dark:text-darkBG'
																					: 'text-neutral-900 dark:text-neutral-100',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className="h-5 w-5"
																				aria-hidden="true"
																			/>
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
							{spData.languages && spData.languages.length > 0 && (
								<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
									Currently set to &#34;
									{spData.languages}
									&#34;.
								</p>
							)}
							<p className="mt-2 text-sm text-neutral-500">
								Choose up to 5 languages you are good at.
							</p>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<Listbox
								value={selectedPurposes}
								onChange={(e: Array<{ name: string; id: number }>) => {
									if (e.length < 4) {
										if (e.length === 0) {
											setSelectedPurposes([]);
										} else if (e.length === 1) {
											setSelectedPurposes([e[0]]);
										} else {
											setSelectedPurposes(e);
										}
									}
								}}
								multiple
							>
								{({ open }) => (
									<>
										<Listbox.Label
											id="purposes"
											className="text-md block
                    text-neutral-700 dark:text-neutral-300"
										>
											What makes you want to use DevClad?
										</Listbox.Label>
										<div className="relative mt-1">
											<Listbox.Button
												className="dark:bg-darkBG relative w-full cursor-default
                      rounded-md border border-neutral-300 py-2 px-3 pl-3 pr-10
                      text-left shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
											>
												<span className="block truncate">
													{selectedPurposes[0]
														? selectedPurposes
																.map(({ name }) => name)
																.join(', ')
														: 'Select'}
												</span>
												<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
													<ChevronUpDownIcon
														className="h-5 w-5 text-neutral-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options
													className="scrollbar dark:bg-darkBG absolute z-10 mt-1 max-h-60 w-full overflow-auto
                        rounded-md py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
												>
													{purposes.map(({ purpose }) => (
														<Listbox.Option
															key={purpose.id}
															className={({ active }) =>
																classNames(
																	active
																		? 'bg-orange-200 text-black dark:bg-orange-200'
																		: 'bg-snow dark:bg-darkBG text-neutral-900 dark:text-neutral-100',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={purpose}
														>
															{({ active, selected }) => (
																<>
																	<span
																		className={classNames(
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{purpose.name}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-linen dark:text-darkBG'
																					: 'text-neutral-900 dark:text-neutral-100',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className="h-5 w-5"
																				aria-hidden="true"
																			/>
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
							{spData.purpose && spData.purpose.length > 0 && (
								<p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
									Currently set to &#34;
									{spData.purpose}
									&#34;.
								</p>
							)}
							<p className="mt-2 text-sm text-neutral-500">
								Choose up to 3 purposes.
							</p>
						</div>
						<div className="col-span-6 sm:col-span-3">
							<Listbox
								value={selectedCountry}
								onChange={(e: { name: string; code: string }) => {
									setSelectedCountry(e);
								}}
							>
								{({ open }) => (
									<>
										<Listbox.Label
											id="location"
											className="text-md block
                    text-neutral-700 dark:text-neutral-300"
										>
											Location
										</Listbox.Label>
										<div className="relative mt-1">
											<Listbox.Button
												className="dark:bg-darkBG relative w-full cursor-default
                      rounded-md border border-neutral-300 py-2 px-3 pl-3 pr-10
                      text-left shadow-sm focus:outline-none dark:border-neutral-800 sm:text-sm"
											>
												<span className="block truncate">
													{selectedCountry
														? selectedCountry.name
														: 'Select'}
												</span>
												<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
													<ChevronUpDownIcon
														className="h-5 w-5 text-neutral-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options
													className="scrollbar dark:bg-darkBG absolute z-10 mt-1 max-h-60 w-full overflow-auto
                        rounded-md py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
												>
													{countries.map(({ country }) => (
														<Listbox.Option
															key={country.code}
															className={({ active }) =>
																classNames(
																	active
																		? 'bg-orange-200 text-black dark:bg-orange-200'
																		: 'bg-snow dark:bg-darkBG text-neutral-900 dark:text-neutral-100',
																	'relative cursor-default select-none py-2 pl-3 pr-9'
																)
															}
															value={country}
														>
															{({ active, selected }) => (
																<>
																	<span
																		className={classNames(
																			selected
																				? 'font-semibold'
																				: 'font-normal',
																			'block truncate'
																		)}
																	>
																		{country.name}
																	</span>

																	{selected ? (
																		<span
																			className={classNames(
																				active
																					? 'text-linen dark:text-darkBG'
																					: 'text-neutral-900 dark:text-neutral-100',
																				'absolute inset-y-0 right-0 flex items-center pr-4'
																			)}
																		>
																			<CheckIcon
																				className="h-5 w-5"
																				aria-hidden="true"
																			/>
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
							{spData.location && spData.location.length > 0 && (
								<p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
									Currently set to &#34;
									{spData.location}
									&#34;.
								</p>
							)}
							<p className="mt-2 text-sm text-neutral-500">
								Optional but results in better algorithm performance.
							</p>
						</div>
						<div className="col-span-6 sm:col-span-5">
							<label
								htmlFor="timezone"
								className="text-md block  text-neutral-700 dark:text-neutral-300"
							>
								TimeZone
								<p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
									{profileTimezone} timezone detected.{' '}
									<button
										type="button"
										className="text-md text-blue-500 dark:text-blue-300"
										onClick={() => {
											setProfileTimezone(detected);
											setFieldValue('timezone', detected);
										}}
									>
										Refetch
									</button>
								</p>
							</label>
						</div>
					</div>
					<div className="mt-10 px-4 py-3 text-right sm:px-6">
						<PrimaryButton isSubmitting={isSubmitting}>
							<span className="text-sm">Save</span>
						</PrimaryButton>
					</div>
				</Form>
			)}
		</Formik>
	);
}
