import { ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { forgotPassword, passwordChange, passwordReset } from '../../services/auth.services';
import { Error, Success, Warning } from '../../utils/Feedback.utils';
import useDocumentTitle from '../../utils/useDocumentTitle';
import { PrimaryButton } from '../../utils/Buttons.utils';
import { InterfaceEmail } from './ChangeEmail.forms';

interface PasswordReset {
  password1: string;
  password2: string;
  errors?: {
    password1?: string;
    password2?: string;
  }
}

export default function PasswordResetForm(): JSX.Element {
  const [resetDone, setresetDone] = useState(false);
  const { uid, token } = useParams() as { uid: string; token: string };
  if (uid && token) {
    useDocumentTitle('Password Reset');
  }
  const validate = (values: PasswordReset) => {
    const errors: PasswordReset['errors'] = {};
    if (!values.password1) {
      errors.password1 = 'Required';
    }
    if (!values.password2) {
      errors.password2 = 'Required';
    }
    if (values.password1.length < 8) {
      errors.password1 = 'Password must be at least 8 characters.';
    }
    if ((values.password1 !== values.password2) && (values.password2.length > 0)) {
      errors.password1 = 'Passwords do not match';
      errors.password2 = 'Passwords do not match';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=[\S]+$)/;
    // /^[@#](?=.{7,13}$)(?=\w{7,13})(?=[^aeiou_]{7,13})(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(values.password1)) {
      errors.password1 = 'Password must contain at least one number, one lowercase, one uppercase, and one special character.';
    }
    return errors;
  };

  // setSubmitting typing issue: https://github.com/jaredpalmer/formik/issues/2086
  const handlePassChange = async (values: PasswordReset, { setSubmitting }: any) => {
    setSubmitting(true);
    const {
      password1, password2,
    } = values;
    if (uid && token) {
      await passwordReset(password1, password2, uid, token).then(() => {
        toast.custom(
          <Success success="Password reset successful." />,
          { id: 'success-password-reset', duration: 3000 },
        );
        setresetDone(true);
      }).catch((err) => {
        toast.custom(
          <Error error={err} />,
          { id: 'error-password-reset', duration: 5000 },
        );
      });
    } else {
      await passwordChange(password1, password2).then(() => {
        toast.custom(
          <Success success="Password change successful." />,
          { id: 'success-password-change', duration: 3000 },
        );
        setresetDone(true);
      }).catch((err) => {
        toast.custom(
          <Error error={err} />,
          { id: 'error-password-change', duration: 5000 },
        );
      });
    }
    setSubmitting(false);
  };
  return (
    <Formik
      initialValues={{
        password1: '', password2: '',
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        handlePassChange(values, { setSubmitting });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6" action="#" method="POST">
          <Warning warning="This is a sensitive operation. Recommended: Save this password in a Cloud Keychain/Password Manager." />
          <div>
            <label
              htmlFor="password1"
              className="block text-sm text-left ml-1
              font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
              <div className="mt-1 relative">
                <Field
                  id="password1"
                  name="password1"
                  type="password"
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  aria-describedby="password-description"
                  required
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
              </div>
              <ErrorMessage
                name="password1"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </label>
            <p className="mt-2 pl-2 text-sm text-gray-600 dark:text-gray-400" id="password-description">
              At least 8 characters.
            </p>
            <p className="mt-2 pl-2 text-xs text-gray-600 dark:text-gray-400" id="password-description">
              Tip: Autogenerate a password.
            </p>
          </div>
          <div>
            <label
              htmlFor="password2"
              className="block text-sm text-left ml-1
              font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm New Password
              <div className="mt-1 relative">
                <Field
                  id="password2"
                  name="password2"
                  type="password"
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
              </div>
              <ErrorMessage
                name="password2"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </label>
          </div>

          <div>
            {!resetDone
              ? (
                <div className="flex justify-center">
                  <PrimaryButton
                    isSubmitting={isSubmitting}
                  >
                    <span className="font-bold text-md">
                      {isSubmitting ? 'Switching Password...' : 'Switch Password'}
                      {' '}
                      <span className="text-md">🔐</span>
                    </span>
                  </PrimaryButton>
                </div>
              )
              : (
                <Link className="flex justify-center" to="/">
                  <span
                    className="mt-5 border border-transparent bg-orange-700 text-white
                    dark:bg-raisinBlack2 duration-500 rounded-md py-2 px-4
                    inline-flex justify-center text-sm font-bold dark:text-fuchsia-300"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="ml-2 font-bold text-base">
                        <span>
                          Password Reset Successful
                        </span>
                      </div>
                    </div>
                  </span>
                </Link>
              )}
          </div>
        </Form>
      )}
    </Formik>
  );
}

export function ForgotPasswordForm(): JSX.Element {
  useDocumentTitle('Password Reset');
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
    const {
      email,
    } = values;
    await forgotPassword(email).then((res) => {
      if (res.detail === 'Password reset e-mail has been sent.') {
        toast.custom(
          <Success success="Link Sent 🔗" />,
          { id: 'reset-link-sent', duration: 3000 },
        );
        setchangedEmail(true);
      }
    }).catch((err) => {
      toast.custom(
        <Error error={err} />,
        { id: 'error-pass-link', duration: 5000 },
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
          <Warning warning="Make sure to have access to your email. Reset link will be sent." />
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
                      {isSubmitting ? 'Sending Link...' : 'Send Link'}
                      {' '}
                      <span className="text-md">🔗</span>
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
                          Reset Link 🔗 Sent
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
