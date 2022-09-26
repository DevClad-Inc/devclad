/* eslint-disable no-param-reassign */
import React, { Fragment, useState } from 'react';
import {
  Formik, Form, ErrorMessage, Field,
} from 'formik';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { initialSocialProfileState, SocialProfile, SocialProfileFormValues } from '@/lib/InterfacesStates.lib';
import { updateSocialProfile } from '@/services/profile.services';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { Success, Error } from '@/lib/Feedback.lib';
import Countries from '@/lib/list/Countries.list.json';
import Languages from '@/lib/list/Languages.list.json';
import Purposes from '@/lib/list/Purpose.list.json';

import classNames from '@/lib/ClassNames.lib';
import { socialProfileQuery } from '@/lib/queriesAndLoaders';
import LoadingCard from '../LoadingCard';

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

const purposes = Purposes.map((purpose) => ({ purpose })) as { purpose: {
  name: string;
  id: number;
} }[];

// const tzDeviation = [
//   { name: '+/- 0', id: 0 },
//   { name: '+/- 2', id: 1 },
//   { name: '+/- 4', id: 2 },
//   { name: '+/- 6', id: 3 },
//   { name: '+/- 8', id: 4 },
//   { name: 'Any', id: 5 },
// ];

const ideaStatus = [
  { name: 'Open to exploring ideas.', id: 0 },
  { name: 'Not open to exploring ideas.', id: 1 },
  { name: 'Need people working on my idea.', id: 2 },
];

const countries = Countries.map((country) => ({ country })) as {
  country: {
    name:string, code:string
  }
}[];

const languages = Languages.map((language) => ({ language })) as { language: {
  name: string;
  id: number;
} }[];

interface InitialSocialDataProps {
  initialSocialData: {} | null;
}

export default function SocialProfileForm(
  { initialSocialData }: InitialSocialDataProps,
): JSX.Element {
  let socialProfileData: SocialProfile = { ...initialSocialProfileState };
  const {
    data: socialProfileQueryData,
    isSuccess: socialProfileQuerySuccess,
    isLoading: socialProfileQueryLoading,
  } = useQuery(
    {
      ...socialProfileQuery(),
      initialData: initialSocialData,
    },
  );
  if (socialProfileQuerySuccess && socialProfileQueryData !== null) {
    const { data } = socialProfileQueryData as { data: SocialProfile };
    socialProfileData = data;
  }
  // const [selectedTzDeviation,
  //   setselectedTzDeviation] = useState<{ name:string, id:number }>();
  const [selectedIdeaStatus, setselectedIdeaStatus] = useState<{ name:string, id:number }>();
  const [selectedDevType,
    setselectedDevType] = useState<Array<{
    name:string, id:number
  }>>([]);
  const [selectedPrefDevType, setselectedPrefDevType] = useState<{ name:string, id:number }>();
  const [selectedLanguages, setSelectedLanguages] = useState<Array<{ name:string, id:number }>>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<Array<{ name:string, id:number }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<{ name:string, code:string }>();
  let detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // this is a hack to get the timezone to display correctly; FUCK YOU CHROME
  // this is not needed on safari or firefox
  if (detected === 'Asia/Calcutta') {
    detected = 'Asia/Kolkata';
  }
  const [profileTimezone, setProfileTimezone] = React.useState<string>(detected);
  const qc = useQueryClient();
  const validate = (values: SocialProfileFormValues) => {
    const errors: SocialProfileFormValues['errors'] = {};
    // validation for other fields only is UserStatus is "Not Submitted"
    // RAW XP
    if (!values.rawXP) {
      errors.rawXP = 'Required';
    }
    if ((values.rawXP)
    && (values.rawXP > 50 || values.rawXP < 0)) {
      errors.rawXP = 'Must be between 0 and 50';
    }
    return errors;
  };
  const handleSubmit = async (values: SocialProfileFormValues, { setSubmitting }: any) => {
    try {
      values.preferredDevType = selectedPrefDevType?.name;
      values.ideaStatus = selectedIdeaStatus?.name;
      values.location = selectedCountry?.name;
      values.devType = selectedDevType.map((type: { name:string, id:number }) => type.name).sort().join(', ');
      values.languages = selectedLanguages.map((language: { name:string, id:number }) => language.name).sort().join(', ');
      values.purpose = selectedPurposes.map((purpose: { name:string, id:number }) => purpose.name).sort().join(', ');
      setSubmitting(true);
      await updateSocialProfile(values, socialProfileData)
        .then(async () => {
          setSubmitting(false);
          await qc.invalidateQueries();
          toast.custom(
            <Success success="Preferences updated successfully" />,
            { id: 'social-update-success' },
          );
        });
    } catch (error: any) {
      const { data } = error.response;
      if (data.timezone) {
        toast.custom(<Error error={data.timezone} />, { id: 'profile-update-error' });
      } else {
        toast.custom(<Error error="Error saving. Please fill required fields." />, {
          id: 'social-update-error-unknown',
          position: 'top-right',
        });
      }
      setSubmitting(false);
    }
  };
  if (socialProfileQueryLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingCard />
      </div>
    );
  }
  return (
    <Formik
      initialValues={{
        videoCallFriendly: socialProfileData.video_call_friendly,
        timezone: detected,
        preferredDevType: socialProfileData.preferred_dev_type,
        ideaStatus: socialProfileData.idea_status,
        rawXP: socialProfileData.raw_xp,
        purpose: socialProfileData.purpose,
        location: socialProfileData.location,
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
                htmlFor="rawXP"
                className="block text-md text-left pl-1
           text-neutral-700 dark:text-neutral-300"
              >
                Raw Experience
                <Field
                  type="number"
                  id="rawXP"
                  name="rawXP"
                  rows={3}
                  className="mt-1 block w-full dark:bg-darkBG border border-neutral-300
                  dark:border-neutral-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                  placeholder=""
                />
                <ErrorMessage
                  name="rawXP"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
                <p className="mt-2 text-sm text-neutral-500">
                  Raw experience (years) building any piece of software/hardware.
                </p>
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <Listbox
                value={selectedIdeaStatus}
                onChange={(e: { name:string, id: number }) => setselectedIdeaStatus(e)}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label
                      id="ideaStatus"
                      className="block text-md
                    text-neutral-700 dark:text-neutral-300"
                    >
                      Idea Status

                    </Listbox.Label>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-darkBG py-2 pl-3 pr-10 text-left border border-neutral-300
                      dark:border-neutral-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedIdeaStatus ? (selectedIdeaStatus.name) : 'Select'
                        }

                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
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
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto scrollbar rounded-md
                        dark:bg-darkBG py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {ideaStatus.map((status) => (
                            <Listbox.Option
                              key={status.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-orange-300'
                                  : 'text-neutral-900 dark:text-neutral-100 bg-snow dark:bg-darkBG',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )}
                              value={status}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {status.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-linen dark:text-darkBG' : 'text-neutral-900 dark:text-neutral-100',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                name="ideaStatus"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
              {(socialProfileData.idea_status
                    && socialProfileData.idea_status.length > 0) && (
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                      Currently set to
                      {' '}
                      &#34;
                      {socialProfileData.idea_status}
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
                onChange={(e: { name:string, id: number }) => {
                  setselectedPrefDevType(e);
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label
                      id="preferredDevType"
                      className="block text-md
                    text-neutral-700 dark:text-neutral-300"
                    >
                      Preferred Development Type

                    </Listbox.Label>

                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-darkBG py-2 pl-3 pr-10 text-left border border-neutral-300
                      dark:border-neutral-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedPrefDevType ? (selectedPrefDevType.name) : 'Select'
                        }

                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
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
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto scrollbar rounded-md
                        dark:bg-darkBG py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {devType.map((type) => (
                            <Listbox.Option
                              key={type.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-orange-300'
                                  : 'text-neutral-900 dark:text-neutral-100 bg-snow dark:bg-darkBG',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )}
                              value={type}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {type.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-linen dark:text-darkBG' : 'text-neutral-900 dark:text-neutral-100',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
              {(socialProfileData.preferred_dev_type
                    && socialProfileData.preferred_dev_type.length > 0) && (
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                      Currently set to
                      {' '}
                      &#34;
                      {socialProfileData.preferred_dev_type}
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
                onChange={
                  (e: Array<{ name:string, id:number }>) => {
                    if (e.length < 4) {
                      if (e.length === 0) {
                        setselectedDevType([]);
                      } else if (e.length === 1) {
                        setselectedDevType([e[0]]);
                      } else {
                        setselectedDevType(e);
                      }
                    }
                  }
                }
                multiple
              >
                {({ open }) => (
                  <>
                    <Listbox.Label
                      id="devType"
                      className="block text-md
                    text-neutral-700 dark:text-neutral-300"
                    >
                      Development Type

                    </Listbox.Label>

                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-darkBG py-2 pl-3 pr-10 text-left border border-neutral-300
                      dark:border-neutral-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedDevType[0] ? (selectedDevType.map(({ name }) => name).join(', ')) : 'Select'
                        }

                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
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
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto scrollbar rounded-md
                        dark:bg-darkBG py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {devType.map((type) => (
                            <Listbox.Option
                              key={type.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-orange-300'
                                  : 'text-neutral-900 dark:text-neutral-100 bg-snow dark:bg-darkBG',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )}
                              value={type}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {type.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-linen dark:text-darkBG' : 'text-neutral-900 dark:text-neutral-100',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
              {(socialProfileData.dev_type && socialProfileData.dev_type.length > 0) && (
              <p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
                Currently set to
                {' '}
                &#34;
                {socialProfileData.dev_type}
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
                  (e: Array<{ name:string, id:number }>) => {
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
                      className="block text-md
                    text-neutral-700 dark:text-neutral-300"
                    >
                      Languages

                    </Listbox.Label>

                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-darkBG py-2 pl-3 pr-10 text-left border border-neutral-300
                      dark:border-neutral-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedLanguages[0] ? (selectedLanguages.map(({ name }) => name).join(', ')) : 'Select'
                        }

                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
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
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto scrollbar rounded-md
                        dark:bg-darkBG py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {languages.map(({ language }) => (
                            <Listbox.Option
                              key={language.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-orange-300'
                                  : 'text-neutral-900 dark:text-neutral-100 bg-snow dark:bg-darkBG',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )}
                              value={language}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {language.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-linen dark:text-darkBG' : 'text-neutral-900 dark:text-neutral-100',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
              {(socialProfileData.languages && socialProfileData.languages.length > 0) && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Currently set to
                {' '}
                &#34;
                {socialProfileData.languages}
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
                onChange={
                  (e: Array<{ name:string, id:number }>) => {
                    if (e.length < 4) {
                      if (e.length === 0) {
                        setSelectedPurposes([]);
                      } else if (e.length === 1) {
                        setSelectedPurposes([e[0]]);
                      } else {
                        setSelectedPurposes(e);
                      }
                    }
                  }
                }
                multiple
              >
                {({ open }) => (
                  <>
                    <Listbox.Label
                      id="purposes"
                      className="block text-md
                    text-neutral-700 dark:text-neutral-300"
                    >
                      What makes you want to use DevClad?
                    </Listbox.Label>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-darkBG py-2 pl-3 pr-10 text-left border border-neutral-300
                      dark:border-neutral-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedPurposes[0] ? (selectedPurposes.map(({ name }) => name).join(', ')) : 'Select'
                        }

                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
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
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto scrollbar rounded-md
                        dark:bg-darkBG py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {purposes.map(({ purpose }) => (
                            <Listbox.Option
                              key={purpose.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-orange-300'
                                  : 'text-neutral-900 dark:text-neutral-100 bg-snow dark:bg-darkBG',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )}
                              value={purpose}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {purpose.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-linen dark:text-darkBG' : 'text-neutral-900 dark:text-neutral-100',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
              {(socialProfileData.purpose && socialProfileData.purpose.length > 0) && (
              <p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
                Currently set to
                {' '}
                &#34;
                {socialProfileData.purpose}
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
                onChange={(e: { name:string, code:string }) => {
                  setSelectedCountry(e);
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label
                      id="location"
                      className="block text-md
                    text-neutral-700 dark:text-neutral-300"
                    >
                      Location

                    </Listbox.Label>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-darkBG py-2 pl-3 pr-10 text-left border border-neutral-300
                      dark:border-neutral-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        (selectedCountry) ? (selectedCountry.name) : 'Select'
                        }

                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
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
                          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto scrollbar rounded-md
                        dark:bg-darkBG py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {countries.map(({ country }) => (
                            <Listbox.Option
                              key={country.code}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-orange-300'
                                  : 'text-neutral-900 dark:text-neutral-100 bg-snow dark:bg-darkBG',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )}
                              value={country}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {country.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-linen dark:text-darkBG' : 'text-neutral-900 dark:text-neutral-100',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
              {(socialProfileData.location && socialProfileData.location.length > 0) && (
              <p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
                Currently set to
                {' '}
                &#34;
                {socialProfileData.location}
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
                className="block text-md  text-neutral-700 dark:text-neutral-300"
              >
                TimeZone
                <p className="mt-2 text-sm  text-neutral-600 dark:text-neutral-400">
                  {profileTimezone}
                  {' '}
                  timezone detected.
                  {' '}
                  <button
                    type="button"
                    className="text-md text-blue-500 dark:text-blue-300"
                    onClick={() => { setProfileTimezone(detected); setFieldValue('timezone', detected); }}
                  >
                    Refetch
                  </button>
                </p>
              </label>
            </div>
          </div>
          <div className="mt-10 px-4 py-3 text-right sm:px-6">
            <PrimaryButton
              isSubmitting={isSubmitting}
            >
              <span className="text-sm">
                Save
              </span>
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
