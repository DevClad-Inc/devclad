import {
  ShieldExclamationIcon,
  ShieldCheckIcon,
  InboxArrowDownIcon,
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { changeEmail, checkVerified, resendEmail } from '@/services/auth.services';
import { Error, Success, Warning } from '@/lib/Feedback.lib';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { User, initialUserState, InterfaceEmail } from '@/lib/InterfacesStates.lib';
import { userQuery } from '@/lib/queriesAndLoaders';
import LoadingCard from '../LoadingCard';

export default function ChangeEmailForm(): JSX.Element {
  let loggedInUser: User = { ...initialUserState };
  let verified = false;
  const qc = useQueryClient();
  const {
    data: userQueryData,
    isSuccess: userQuerySuccess,
    isLoading: userQueryLoading,
  } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
  }
  const verifiedQuery = useQuery(['verified'], async () => checkVerified());
  if (verifiedQuery.isSuccess && verifiedQuery.data !== null) {
    const { data } = verifiedQuery.data;
    verified = data.verified;
  }
  const [changedEmail, setchangedEmail] = useState(false);
  const validate = (values: InterfaceEmail) => {
    const errors: InterfaceEmail['errors'] = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  };

  // setSubmitting typing issue: https://github.com/jaredpalmer/formik/issues/2086
  const handlePassChange = async (values: InterfaceEmail, { setSubmitting }: any) => {
    setSubmitting(true);
    const { email } = values;
    await changeEmail(email)
      .then(async () => {
        await qc.invalidateQueries(['user']);
        await qc.invalidateQueries(['verified']);
        toast.custom(<Success success="Verification Email Sent." />, {
          id: 'verification-mail-sent',
          duration: 3000,
        });
        setchangedEmail(true);
      })
      .catch(() => {
        toast.custom(<Error error="Email already exists." />, {
          id: 'error-email-change',
          duration: 5000,
        });
      });
    setSubmitting(false);
  };
  if (userQueryLoading || verifiedQuery.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingCard />
      </div>
    );
  }
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        handlePassChange(values, { setSubmitting });
      }}
    >
      {({ isSubmitting }) => (
        <>
          <div className="w-fit">
            {verified === true ? (
              <span className="inline-flex rounded-md p-2 text-sm dark:bg-phthaloGreen dark:text-honeyDew">
                {' '}
                <ShieldCheckIcon className="mr-2 h-6 w-5 text-green-500" /> {loggedInUser.email} is{' '}
                verified.
              </span>
            ) : (
              <>
                <Warning warning="Please verify your email. You will not be able to login with an unverified email." />
                <span className="inline-flex rounded-md p-2 text-sm dark:bg-bloodRed/60 dark:text-mistyRose">
                  {' '}
                  <ShieldExclamationIcon className="mr-2 h-6 w-5 text-bloodRed dark:text-mistyRose" />{' '}
                  {loggedInUser.email} is unverified.
                </span>
              </>
            )}
          </div>
          <Form className="mt-5 sm:flex sm:items-center" action="#" method="POST">
            <div className="w-full sm:max-w-xs">
              <Field
                id="email"
                name="email"
                type="email"
                placeholder={loggedInUser.email ? loggedInUser.email : 'cactus@jack.com'}
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-neutral-300
                    py-2 px-3 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-neutral-700
                    dark:bg-darkBG sm:text-sm"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </div>
            {!verified && changedEmail ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => loggedInUser.email && resendEmail(loggedInUser.email)}
                >
                  <span
                    className="inline-flex w-full items-center justify-center
                  rounded-md bg-orange-700 py-2 px-4 text-sm text-white
                  duration-500 dark:bg-darkBG dark:text-orange-300 sm:mt-0 sm:ml-3
                  sm:w-auto sm:text-sm"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <InboxArrowDownIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="ml-2 text-base font-bold">
                        <span>Resend Email.</span>
                      </div>
                    </div>
                  </span>
                </button>
              </div>
            ) : (
              <div
                className="mt-3 inline-flex w-full items-center justify-center
                border border-transparent px-4 py-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <PrimaryButton isSubmitting={isSubmitting}>
                  <span>{isSubmitting ? 'Updating Email...' : 'Update Email ✨'}</span>
                </PrimaryButton>
              </div>
            )}
          </Form>
        </>
      )}
    </Formik>
  );
}
