import { CheckCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { changeEmail } from '../../services/auth.services';
import { Error, Success, Warning } from '../../utils/Feedback.utils';
import useDocumentTitle from '../../utils/useDocumentTitle';
import { PrimaryButton } from '../../utils/Buttons.utils';

interface ChangeEmail {
  email: string;
  errors?: {
    email?: string;
  }
}

export default function ChangeEmailForm(): JSX.Element {
  useDocumentTitle('Password Reset');
  const [changedEmail, setchangedEmail] = useState(false);
  const validate = (values: ChangeEmail) => {
    const errors: ChangeEmail['errors'] = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  };

  // setSubmitting typing issue: https://github.com/jaredpalmer/formik/issues/2086
  const handlePassChange = async (values: ChangeEmail, { setSubmitting }: any) => {
    setSubmitting(true);
    const {
      email,
    } = values;
    await changeEmail(email).then(() => {
      toast.custom(
        <Success success="Verification Email Sent." />,
        { id: 'verification-mail-sent', duration: 3000 },
      );
      setchangedEmail(true);
    }).catch((err) => {
      toast.custom(
        <Error error={err} />,
        { id: 'error-email-change', duration: 5000 },
      );
    });
    setSubmitting(false);
  };
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
        <Form className="space-y-6" action="#" method="POST">
          <Warning warning="Changing your email will require you to verify your new email address." />
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-left pl-1
              font-medium text-gray-700 dark:text-gray-300"
            >
              Email
              <div className="mt-1 relative">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="cactus@jack.com"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </label>
          </div>

          <div>
            {!changedEmail
              ? (
                <div className="flex justify-center">
                  <PrimaryButton
                    isSubmitting={isSubmitting}
                  >
                    <span className="font-bold text-md">
                      {isSubmitting ? 'Changing Email...' : 'Change Email'}
                      {' '}
                      <span className="text-md">📧</span>
                    </span>
                  </PrimaryButton>
                </div>
              )
              : (
                <div className="flex justify-center">
                  <span
                    className="mt-5 border border-transparent bg-orange-700 text-white
                    dark:bg-raisinBlack2 duration-500 rounded-md py-2 px-4
                    inline-flex justify-center text-sm font-bold dark:text-fuchsia-300"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="ml-2 font-bold text-base">
                        <span>
                          Verification Email Sent.
                        </span>
                      </div>
                    </div>
                  </span>
                </div>
              )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
