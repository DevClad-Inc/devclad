import React from 'react';
import {
  Formik, Form, ErrorMessage, Field,
} from 'formik';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { initialSocialProfileState, SocialProfile, SocialProfileUpdate } from '../../utils/InterfacesStates.utils';
import { getProfile, updateSocialProfile } from '../../services/profile.services';
import { LoadingButton, PrimaryButton } from '../../utils/Buttons.utils';
import { Success, Error } from '../../utils/Feedback.utils';

interface SocialProfileFormValues extends SocialProfileUpdate {
  errors?: {
    calendly?: string;
    videoCallFriendly?: boolean;
    preferredTimezoneDeviation?: string;
    preferredDevType?: string;
    ideaStatus?: string;
  }
}

export default function SocialProfileForm(): JSX.Element {
  let socialProfileData: SocialProfile = { ...initialSocialProfileState };
  const socialProfileQuery = useQuery(['profile'], () => getProfile());
  if (socialProfileQuery.isSuccess && socialProfileQuery.data !== null) {
    const { data } = socialProfileQuery;
    socialProfileData = data.data;
  }
  const qc = useQueryClient();
  const validate = (values: SocialProfileFormValues) => {
    const errors: SocialProfileFormValues['errors'] = {};
    if (!values.preferredTimezoneDeviation) {
      errors.preferredTimezoneDeviation = 'Required';
    }
    if (!values.preferredDevType) {
      errors.preferredDevType = 'Required';
    }
    if (!values.ideaStatus) {
      errors.ideaStatus = 'Required';
    }
    return errors;
  };
  const handleSubmit = async (values: SocialProfileFormValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      await updateSocialProfile(values, socialProfileData)
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
              <label
                htmlFor="calendly"
                className="block text-sm font-medium
               text-gray-700 dark:text-gray-300"
              >
                Calendly Link
                <Field
                  type="text"
                  name="calendly"
                  id="calendly"
                  autoComplete="given-name"
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
