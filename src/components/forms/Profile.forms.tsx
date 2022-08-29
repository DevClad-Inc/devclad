import React, { useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Formik, Form, ErrorMessage, Field,
} from 'formik';
import TimezoneSelect from 'react-timezone-select';
import { getProfile, updateProfile } from '../../services/AuthService';
import { LoadingButton, PrimaryButton } from '../../utils/Buttons.utils';
import { UpdateFormProps } from './Auth.forms';
import { initialProfileState, Profile } from '../../context/User.context';
import { ThemeContext } from '../../context/Theme.context';
// todo: remove react-select and react-timezone-select; build our own
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

// only first name, last name, and username can be updated via this form
export default function UpdateProfileForm({
  setUpdateUserMessageState,
}: UpdateFormProps): JSX.Element {
  const { darkMode } = useContext(ThemeContext);
  const customStyles = {
    control: (base: any, state: { isFocused: any; }) => ({
      ...base,
      background: 'black',
      borderRadius: state.isFocused ? '10px 10px 10px 10px' : '5px 5px 5px 5px',
      borderColor: 'gray',

      '&:hover': {
        borderColor: 'black',
      },
      boxShadow: state.isFocused ? '#222430' : '#222430',
    }),
    menu: () => ({
      borderRadius: 0,
      color: 'black',
      background: 'gray',
      marginTop: 0,
    }),
  };
  const qc = useQueryClient();
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [profileTimezone, setProfileTimezone] = React.useState<string>('');
  let profileData: Profile = { ...initialProfileState };
  const profileQuery = useQuery(['profile'], () => getProfile());
  if (profileQuery.isSuccess && profileQuery.data !== null) {
    const { data } = profileQuery;
    profileData = data.data;
  }
  if (profileTimezone === '' && profileData.timezone !== undefined) {
    const tz = profileData.timezone;
    setProfileTimezone(tz);
  }

  const validate = (values: UpdateProfileFormValues) => {
    const errors: UpdateProfileFormValues['errors'] = {};
    // TIMEZONE
    if (!values.timezone) {
      errors.timezone = 'Required';
    }
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
        timezone: profileTimezone,
        // avatar: profileData.avatar,
        pronouns: profileData.pronouns,
        website: profileData.website,
        linkedin: profileData.linkedin,
        // languages: profileData.languages,
        // dev_type: profileData.dev_type,
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
                  Your raw experience building any piece of software/hardware. Max is 50.
                </p>
              </label>
            </div>
            <div className="col-span-6 sm:col-span-5">
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                TimeZone
                {/* DST aware timezone selector */}
                <p className="mt-2 text-sm text-gray-500">
                  {detected}
                  {' '}
                  timezone detected.
                  {' '}
                </p>
                <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                  You have currently set
                  {' '}
                  {profileData.timezone}
                  {' '}
                  as your timezone.
                </p>
                {
                darkMode ? (
                  <TimezoneSelect
                    styles={customStyles}
                    name="timezone"
                    id="timezone"
                    value={profileTimezone}
                    onChange={(e) => {
                      setProfileTimezone(e.value);
                      setFieldValue('timezone', e.value);
                    }}
                    className="mt-1 block w-full text-gray-50"
                    classNamePrefix="react-timezone-select"
                  />
                ) : (
                  <TimezoneSelect
                    name="timezone"
                    id="timezone"
                    value={profileTimezone}
                    onChange={(e) => {
                      setProfileTimezone(e.value);
                      setFieldValue('timezone', e.value);
                    }}
                    className="mt-1 block w-full dark:bg-raisinBlack2"
                    classNamePrefix="react-timezone-select"
                  />
                )
}
                <ErrorMessage
                  name="timezone"
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
