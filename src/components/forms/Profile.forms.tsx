import React, { useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Formik, Form, ErrorMessage,
} from 'formik';
import TimezoneSelect from 'react-timezone-select';
import { getProfile, updateProfile } from '../../services/AuthService';
import { PrimaryButton } from '../../utils/Buttons';
import { UpdateFormProps } from './Auth.forms';
import { initialProfileState, Profile } from '../../context/User.context';
import { ThemeContext } from '../../context/Theme.context';

interface UpdateProfileFormValues {
  timezone?: string;
  errors?: {
    timezone?: string;
  };
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
  let profileData: Profile = { ...initialProfileState };
  const profileQuery = useQuery(['profile'], () => getProfile());
  if (profileQuery.isSuccess && profileQuery.data !== null) {
    const { data } = profileQuery;
    profileData = data.data;
    // set('profile', profileData);
  }
  const [profileTimezone, setProfileTimezone] = React.useState<string>(
    profileData.timezone
      ? profileData.timezone
      : detected,
  );

  const validate = (values: UpdateProfileFormValues) => {
    const errors: UpdateProfileFormValues['errors'] = {};
    if (!values.timezone) {
      errors.timezone = 'Required';
    }
    return errors;
  };
  const handleSubmit = async (values: UpdateProfileFormValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const { timezone } = values;
      await updateProfile(timezone)
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
  return (
    <Formik
      initialValues={{
        timezone: profileTimezone,
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, { setSubmitting });
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-4">
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
                <p className="mt-2 text-sm text-gray-500">
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
