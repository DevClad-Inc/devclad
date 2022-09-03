/* eslint-disable no-param-reassign */
import React, { Fragment, useState } from 'react';
import {
  Formik, Form, ErrorMessage, Field,
} from 'formik';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { initialSocialProfileState, SocialProfile, SocialProfileUpdate } from '../../utils/InterfacesStates.utils';
import { getSocialProfile, updateSocialProfile } from '../../services/profile.services';
import { LoadingButton, PrimaryButton } from '../../utils/Buttons.utils';
import { Success, Error } from '../../utils/Feedback.utils';
import classNames from '../../utils/ClassNames.utils';
import { devType } from './Profile.forms';

interface SocialProfileFormValues extends SocialProfileUpdate {
  errors?: {
    calendly?: string;
    videoCallFriendly?: boolean;
    preferredTimezoneDeviation?: string;
    preferredDevType?: string;
    ideaStatus?: string;
  }
}

const tzDeviation = [
  { name: '+/- 0', id: 0 },
  { name: '+/- 2', id: 1 },
  { name: '+/- 4', id: 2 },
  { name: '+/- 6', id: 3 },
  { name: '+/- 8', id: 4 },
  { name: 'Any', id: 5 },
];

export default function SocialProfileForm(): JSX.Element {
  let socialProfileData: SocialProfile = { ...initialSocialProfileState };
  const socialProfileQuery = useQuery(['social-profile'], () => getSocialProfile());
  if (socialProfileQuery.isSuccess && socialProfileQuery.data !== null) {
    const { data } = socialProfileQuery;
    socialProfileData = data.data;
  }
  const [selectedDevType, setselectedDevType] = useState<{ name:string, id:number }>();
  const [selectedTzDeviation,
    setselectedTzDeviation] = useState<{ name:string, id:number }>();
  const qc = useQueryClient();
  const validate = (values: SocialProfileFormValues) => {
    const errors: SocialProfileFormValues['errors'] = {};
    if (!values.preferredTimezoneDeviation && !socialProfileData.preferred_timezone_deviation) {
      errors.preferredTimezoneDeviation = 'Required';
    }
    if (!values.preferredDevType && !socialProfileData.preferred_dev_type) {
      errors.preferredDevType = 'Required';
    }
    if ((values.calendly)
    && (!((values.calendly.startsWith('http'))
    || (values.calendly.startsWith('https')))
    || (!values.calendly.includes('calendly.com')))) {
      errors.calendly = 'Must start with http or https and include calendly.com';
    }
    return errors;
  };
  const handleSubmit = async (values: SocialProfileFormValues, { setSubmitting }: any) => {
    try {
      values.preferredDevType = selectedDevType?.name;
      values.preferredTimezoneDeviation = selectedTzDeviation?.name;
      setSubmitting(true);
      await updateSocialProfile(values, socialProfileData)
        .then(async () => {
          setSubmitting(false);
          qc.invalidateQueries(['social-profile']);
          toast.custom(
            <Success success="Preferences updated successfully" />,
            { id: 'social-update-success' },
          );
        });
    } catch (error: any) {
      const { data } = error.response;
      if (data.calendly) {
        toast.custom(<Error error={data.calendly} />, { id: 'social-update-error' });
      } else {
        toast.custom(<Error error="Error!" />, { id: 'social-update-error-unknown' });
      }
      setSubmitting(false);
    }
  };
  if (socialProfileQuery.isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingButton />
      </div>
    );
  }
  return (
    <Formik
      initialValues={{
        calendly: socialProfileData.calendly,
        videoCallFriendly: socialProfileData.video_call_friendly,
        preferredTimezoneDeviation: socialProfileData.preferred_timezone_deviation,
        preferredDevType: socialProfileData.preferred_dev_type,
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
              <Listbox
                value={selectedDevType}
                // selectedDevType < 3 or selectedDevType should be already selected
                onChange={(e: { name:string, id: number }) => {
                  setselectedDevType(e);
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label
                      id="devType"
                      className="block text-sm font-medium
                    text-gray-700 dark:text-gray-300"
                    >
                      Development Type

                    </Listbox.Label>
                    {(socialProfileData.preferred_dev_type
                    && socialProfileData.preferred_dev_type.length > 0) && (
                    <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
                      Currently set to
                      {' '}
                      &#34;
                      {socialProfileData.preferred_dev_type}
                      &#34;.
                    </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Preferred Development Type of your 1-on-1 match.
                    </p>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-raisinBlack2 py-2 pl-3 pr-10 text-left border border-gray-300
                      dark:border-gray-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedDevType ? (selectedDevType.name) : 'Select'
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
                value={selectedDevType}
                onChange={(e: { name:string, id: number }) => {
                  setselectedTzDeviation(e);
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label
                      id="tzdeviation"
                      className="block text-sm font-medium
                    text-gray-700 dark:text-gray-300"
                    >
                      TimeZone Deviation (Hours)

                    </Listbox.Label>
                    {(socialProfileData.preferred_timezone_deviation
                    && socialProfileData.preferred_timezone_deviation.length > 0) && (
                    <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
                      Currently set to
                      {' '}
                      &#34;
                      {socialProfileData.preferred_timezone_deviation}
                      &#34;.
                    </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Timezone devation between you and your 1-on-1 match.
                    </p>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md
                      dark:bg-raisinBlack2 py-2 pl-3 pr-10 text-left border border-gray-300
                      dark:border-gray-700 px-3 focus:outline-none shadow-sm sm:text-sm"
                      >
                        <span className="block truncate">
                          {
                        selectedTzDeviation ? (selectedTzDeviation.name) : 'Select'
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
                          {tzDeviation.map((deviation) => (
                            <Listbox.Option
                              key={deviation.id}
                              className={({ active }) => classNames(
                                active
                                  ? 'text-black bg-orange-300 dark:bg-fuchsia-300'
                                  : 'text-gray-900 dark:text-gray-100 bg-snow dark:bg-raisinBlack2',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )}
                              value={deviation}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {deviation.name}
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
              <label
                htmlFor="calendly"
                className="block text-sm font-medium
               text-gray-700 dark:text-gray-300"
              >
                Calendly Link
                <p className="mt-2 text-sm text-gray-500">
                  Add a Calendly link for convenience if you need to.
                </p>
                <Field
                  type="text"
                  name="calendly"
                  id="calendly"
                  placeholder="https://calendly.com/..."
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                <ErrorMessage
                  name="calendly"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
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
