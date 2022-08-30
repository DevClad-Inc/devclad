import React, { Fragment, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import {
  Formik, Form, ErrorMessage, Field,
} from 'formik';
import { getProfile, updateProfile } from '../../services/AuthService';
import { LoadingButton, PrimaryButton } from '../../utils/Buttons.utils';
import { UpdateFormProps } from './Login.forms';
import { initialProfileState, Profile } from '../../context/User.context';
import classNames from '../../utils/ClassNames.utils';

interface UpdateProfileFormValues {
  timezone?: string;
  avatar?: string;
  pronouns?: string;
  about?: string;
  website?: string;
  linkedin?: string;
  languages?: string;
  devType?: string;
  rawXP?: number;
  purpose?: string;
  location?: string;
  errors?: {
    timezone?: string;
    avatar?: string;
    pronouns?: string;
    about?: string;
    website?: string;
    linkedin?: string;
    languages?: string;
    devType?: string;
    rawXP?: string;
    purpose?: string;
    location?: string;
  }
}

const devType = [
  { name: 'AI', id: 0 },
  { name: 'Blockchain', id: 1 },
  { name: 'Game Development', id: 2 },
  { name: 'Hardware', id: 3 },
  { name: 'Mobile/Web', id: 4 },
  { name: 'Native Desktop', id: 5 },
  { name: 'Systems', id: 6 },
  { name: 'Other', id: 7 },
];
// only first name, last name, and username can be updated via this form
export default function UpdateProfileForm({
  setUpdateUserMessageState,
}: UpdateFormProps): JSX.Element {
  const qc = useQueryClient();
  const [selectedDevType, setselectedDevType] = useState<Array<{ name:string, id:number }>>([]);
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [profileTimezone, setProfileTimezone] = React.useState<string>(detected);
  let profileData: Profile = { ...initialProfileState };
  const profileQuery = useQuery(['profile'], () => getProfile());
  if (profileQuery.isSuccess && profileQuery.data !== null) {
    const { data } = profileQuery;
    profileData = data.data;
  }
  const validate = (values: UpdateProfileFormValues) => {
    const errors: UpdateProfileFormValues['errors'] = {};
    // ABOUT
    if (!values.about) {
      errors.about = 'Required';
    }
    // WEBSITE
    if ((values.website)
    && !((values.website.startsWith('http'))
    || (values.website.startsWith('https')))) {
      errors.website = 'Must start with http or https';
    }
    // LINKEDIN
    if ((values.linkedin)
    && (!((values.linkedin.startsWith('http'))
    || (values.linkedin.startsWith('https')))
    || (!values.linkedin.includes('linkedin.com')))) {
      errors.linkedin = 'Must start with http or https and include linkedin.com';
    }
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
  const handleSubmit = async (values: UpdateProfileFormValues, { setSubmitting }: any) => {
    try {
      // eslint-disable-next-line no-param-reassign
      values.devType = selectedDevType.map((type: any) => type.name).sort().join(', ');
      setSubmitting(true);
      await updateProfile(values)
        .then(async () => {
          setUpdateUserMessageState({
            error: '',
            success: 'Profile updated successfully.',
          });
          setSubmitting(false);
          qc.invalidateQueries(['profile']);
        });
    } catch (error: any) {
      const { data } = error.response;
      if (data.timezone) {
        setUpdateUserMessageState({
          error: data.timezone,
          success: '',
        });
      } else {
        setUpdateUserMessageState({
          error: 'Something went wrong. Please try again.',
          success: '',
        });
      }
      setSubmitting(false);
    }
  };
  if (profileQuery.isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingButton />
      </div>
    );
  }
  return (
    <Formik
      initialValues={{
        about: profileData.about,
        timezone: detected,
        // avatar: profileData.avatar,
        pronouns: profileData.pronouns,
        website: profileData.website,
        linkedin: profileData.linkedin,
        // languages: profileData.languages,
        rawXP: profileData.raw_xp,
        // age_range: profileData.age_range,
        // purpose: profileData.purpose,
        // location: profileData.location,
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, { setSubmitting });
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-6">
              <label
                htmlFor="about"
                className="block text-sm text-left pl-1
          font-medium text-gray-700 dark:text-gray-300"
              >
                About
                <Field
                  type="text"
                  as="textarea"
                  id="about"
                  name="about"
                  rows={3}
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                  placeholder="Currently, I'm ..."
                />
                <ErrorMessage
                  name="about"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Tip: Talk about what you like to build and what you are currently working on.
                </p>
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="pronouns"
                className="block text-sm text-left pl-1
          font-medium text-gray-700 dark:text-gray-300"
              >
                Pronouns
                <Field
                  type="text"
                  id="pronouns"
                  name="pronouns"
                  rows={3}
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                  placeholder=""
                />
                <ErrorMessage
                  name="pronouns"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="linkedin"
                className="block text-sm text-left pl-1
          font-medium text-gray-700 dark:text-gray-300"
              >
                LinkedIn
                <Field
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  rows={3}
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                  placeholder="https://linkedin.com/..."
                />
                <ErrorMessage
                  name="linkedin"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="website"
                className="block text-sm text-left pl-1
          font-medium text-gray-700 dark:text-gray-300"
              >
                Website
                <Field
                  type="text"
                  id="website"
                  name="website"
                  rows={3}
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                  placeholder="https://"
                />
                <ErrorMessage
                  name="website"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Tip: Showcase your best build yet if you do not have a website.
                </p>
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="rawXP"
                className="block text-sm text-left pl-1
          font-medium text-gray-700 dark:text-gray-300"
              >
                Raw Experience
                <Field
                  type="number"
                  id="rawXP"
                  name="rawXP"
                  rows={3}
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                  placeholder=""
                />
                <ErrorMessage
                  name="rawXP"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Raw experience (years) building any piece of software/hardware.
                </p>
              </label>
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
                    <Listbox.Label id="devType" className="block text-sm font-medium text-gray-700">Type of Development</Listbox.Label>
                    {(profileData.dev_type && profileData.dev_type.length > 0) && (
                    <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                      You have currently set
                      {' '}
                      &#34;
                      {profileData.dev_type}
                      &#34;
                      {' '}
                      as your development types.
                    </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Choose up to 3.
                    </p>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 dark:bg-raisinBlack2 py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                        <span className="block truncate">
                          {
                        selectedDevType[0] ? (selectedDevType.map(({ name }) => name).join(', ')) : 'Select'
                        }

                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                        dark:bg-raisinBlack2 py-1 text-base shadow-lg ring-1 ring-black
                        ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {devType.map((type) => (
                            <Listbox.Option
                              key={type.id}
                              className={({ active }) => classNames(
                                active ? 'text-black bg-indigo-100 dark:bg-indigo-200' : 'text-gray-900 dark:text-gray-100 bg-white dark:bg-raisinBlack2',
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
                                        active ? 'text-white' : 'text-indigo-600',
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
            </div>
            <div className="col-span-6 sm:col-span-5">
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                TimeZone
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {profileTimezone}
                  {' '}
                  timezone detected.
                  {' '}
                  <button
                    type="button"
                    className="text-sm text-blue-500 dark:text-blue-300"
                    onClick={() => { setProfileTimezone(detected); setFieldValue('timezone', detected); }}
                  >
                    Refetch
                  </button>
                </p>
              </label>
            </div>
          </div>
          <div className="px-4 py-3 text-right sm:px-6">
            <PrimaryButton
              isSubmitting={isSubmitting}
            >
              Save
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
