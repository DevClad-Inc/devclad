import React, {
  ChangeEvent, Fragment, useContext, useState,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import {
  Formik, Form, ErrorMessage, Field,
} from 'formik';
import { toast } from 'react-hot-toast';
import { getProfile, updateProfile, updateProfileAvatar } from '../../services/AuthService';
import { LoadingButton, PrimaryButton } from '../../utils/Buttons.utils';
import classNames from '../../utils/ClassNames.utils';
import Languages from '../../utils/list/Languages.list.json';
import Countries from '../../utils/list/Countries.list.json';
import Purposes from '../../utils/list/Purpose.list.json';
import { Profile, initialProfileState } from '../../utils/InterfacesStates.utils';
import { Error, Success } from '../../utils/Feedback.utils';
import QueryLoader from '../../utils/QueryLoader.utils';
import { ThemeContext } from '../../context/Theme.context';

interface UpdateProfileFormValues {
  timezone?: string;
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

const languages = Languages.map((language) => ({ language })) as { language: {
  name: string;
  id: number;
} }[];

const countries = Countries.map((country) => ({ country })) as {
  country: {
    name:string, code:string
  }
}[];

const purposes = Purposes.map((purpose) => ({ purpose })) as { purpose: {
  name: string;
  id: number;
} }[];

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

export default function UpdateProfileForm(): JSX.Element {
  let profileData: Profile = { ...initialProfileState };
  const profileQuery = useQuery(['profile'], () => getProfile());
  if (profileQuery.isSuccess && profileQuery.data !== null) {
    const { data } = profileQuery;
    profileData = data.data;
  }
  const qc = useQueryClient();
  const [selectedDevType, setselectedDevType] = useState<Array<{ name:string, id:number }>>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Array<{ name:string, id:number }>>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<Array<{ name:string, id:number }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<{ name:string, code:string }>();
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [profileTimezone, setProfileTimezone] = React.useState<string>(detected);
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
      values.location = selectedCountry?.name;
      // eslint-disable-next-line no-param-reassign
      values.devType = selectedDevType.map((type: { name:string, id:number }) => type.name).sort().join(', ');
      // eslint-disable-next-line no-param-reassign
      values.languages = selectedLanguages.map((language: { name:string, id:number }) => language.name).sort().join(', ');
      // eslint-disable-next-line no-param-reassign
      values.purpose = selectedPurposes.map((purpose: { name:string, id:number }) => purpose.name).sort().join(', ');
      setSubmitting(true);
      await updateProfile(values, profileData)
        .then(async () => {
          setSubmitting(false);
          qc.invalidateQueries(['profile']);
          toast.custom(
            <Success success="Profile updated successfully" />,
            { id: 'profile-update-success' },
          );
        });
    } catch (error: any) {
      const { data } = error.response;
      if (data.timezone) {
        toast.custom(<Error error={data.timezone} />, { id: 'profile-update-error' });
      } else {
        toast.custom(<Error error={data.message} />, { id: 'profile-update-error-unknown' });
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
        pronouns: profileData.pronouns,
        website: profileData.website,
        linkedin: profileData.linkedin,
        rawXP: profileData.raw_xp,
        purpose: profileData.purpose,
        location: profileData.location,
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
                    <Listbox.Label
                      id="devType"
                      className="block text-sm font-medium
                    text-gray-700 dark:text-gray-300"
                    >
                      Type of Development

                    </Listbox.Label>
                    {(profileData.dev_type && profileData.dev_type.length > 0) && (
                    <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
                      Currently set to
                      {' '}
                      &#34;
                      {profileData.dev_type}
                      &#34;.
                    </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Choose up to 3.
                    </p>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-raisinBlack2 py-2 pl-3 pr-10 text-left border border-gray-300
                      dark:border-gray-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
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
                                active
                                  ? 'text-black bg-orange-300 dark:bg-fuchsia-300'
                                  : 'text-gray-900 dark:text-gray-100 bg-snow dark:bg-raisinBlack2',
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
                                        active ? 'text-linen dark:text-raisinBlack2' : 'text-gray-900 dark:text-gray-100',
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
                      className="block text-sm font-medium
                    text-gray-700 dark:text-gray-300"
                    >
                      Languages

                    </Listbox.Label>
                    {(profileData.languages && profileData.languages.length > 0) && (
                    <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
                      Currently set to
                      {' '}
                      &#34;
                      {profileData.languages}
                      &#34;.
                    </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Choose up to 5.
                    </p>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-raisinBlack2 py-2 pl-3 pr-10 text-left border border-gray-300
                      dark:border-gray-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedLanguages[0] ? (selectedLanguages.map(({ name }) => name).join(', ')) : 'Select'
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
                          {languages.map(({ language }) => (
                            <Listbox.Option
                              key={language.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-fuchsia-300'
                                  : 'text-gray-900 dark:text-gray-100 bg-snow dark:bg-raisinBlack2',
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
                                        active ? 'text-linen dark:text-raisinBlack2' : 'text-gray-900 dark:text-gray-100',
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
                      className="block text-sm font-medium
                    text-gray-700 dark:text-gray-300"
                    >
                      What makes you want to use DevClad?
                    </Listbox.Label>
                    {(profileData.purpose && profileData.purpose.length > 0) && (
                    <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
                      Currently set to
                      {' '}
                      &#34;
                      {profileData.purpose}
                      &#34;.
                    </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Choose up to 3.
                    </p>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-raisinBlack2 py-2 pl-3 pr-10 text-left border border-gray-300
                      dark:border-gray-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedPurposes[0] ? (selectedPurposes.map(({ name }) => name).join(', ')) : 'Select'
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
                          {purposes.map(({ purpose }) => (
                            <Listbox.Option
                              key={purpose.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-fuchsia-300'
                                  : 'text-gray-900 dark:text-gray-100 bg-snow dark:bg-raisinBlack2',
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
                                        active ? 'text-linen dark:text-raisinBlack2' : 'text-gray-900 dark:text-gray-100',
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
                      className="block text-sm font-medium
                    text-gray-700 dark:text-gray-300"
                    >
                      Location

                    </Listbox.Label>
                    {(profileData.location && profileData.location.length > 0) && (
                    <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
                      Currently set to
                      {' '}
                      &#34;
                      {profileData.location}
                      &#34;.
                    </p>
                    )}
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-raisinBlack2 py-2 pl-3 pr-10 text-left border border-gray-300
                      dark:border-gray-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        (selectedCountry) ? (selectedCountry.name) : 'Select'
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
                          {countries.map(({ country }) => (
                            <Listbox.Option
                              key={country.code}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-fuchsia-300'
                                  : 'text-gray-900 dark:text-gray-100 bg-snow dark:bg-raisinBlack2',
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
                                        active ? 'text-linen dark:text-raisinBlack2' : 'text-gray-900 dark:text-gray-100',
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
                <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">
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
const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

export function AvatarUploadForm() {
  const { darkMode } = useContext(ThemeContext);
  const qc = useQueryClient();
  let profileData: Profile = { ...initialProfileState };
  const profileQuery = useQuery(['profile'], () => getProfile());
  if (profileQuery.isSuccess && profileQuery.data !== null) {
    const { data } = profileQuery;
    profileData = data.data;
  }
  if (profileQuery.isLoading) {
    return <QueryLoader />;
  }
  if (profileQuery.isLoading) {
    return <div>Loading...</div>;
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
      updateProfileAvatar(file).then(() => {
        qc.invalidateQueries(['profile']);
        toast.custom(
          <Success success="Profile avatar updated successfully!" />,
        );
      }).catch(() => {
        toast.custom(<Error error="Please upload a valid image.
        And, keep it below 5MB."
        />);
      });
    }
  };
  const handleonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files && e.target.files[0];
    if (avatar) {
      updateProfileAvatar(avatar).then(() => {
        qc.invalidateQueries(['profile']);
        toast.custom(
          <Success success="Profile avatar updated successfully!" />,
        );
      }).catch(() => {
        toast.custom(<Error error="Profile avatar update failed! Please upload a valid image." />);
      });
    }
  };

  return (
    <>
      <div className="col-span-3">
        <div className="mt-1 flex items-center">
          <img
            className="inline-block object-cover h-24 w-24 rounded-full bg-white"
            src={import.meta.env.VITE_DEVELOPMENT
              ? (import.meta.env.VITE_API_URL + profileData.avatar)
              : profileData.avatar}
            alt=""
          />
        </div>
      </div>
      <div className="col-span-3">
        <div className="mt-1 border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center" onDragOver={enableDropping} onDrop={handleDrop}>
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium
                dark:text-fuchsia-300 dark:hover:text-fuchsia-400 text-orange-700 hover:text-orange-600
                focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-fuchsia-500"
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
              <p className="pl-1 text-black dark:text-linen">or DRAG AND DROP</p>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300">PNG, JPG, GIF, SVG up to 5MB</p>
          </div>
        </div>
      </div>
    </>
  );
}
