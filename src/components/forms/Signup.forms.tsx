import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignUp } from '../../services/AuthService';
import { PrimaryButton } from '../../utils/Buttons.utils';

interface SignupFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
  errors?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    password1?: string;
    password2?: string;
  }
}

interface SignupFormProps {
  signupErrorState: string;
  setSignupErrorState: (signupErrorState: string) => void;
}

export default function SignupForm(
  { signupErrorState, setSignupErrorState }:SignupFormProps,
): JSX.Element {
  const [signedUp, setSignedUp] = useState(false);
  const validate = (values: SignupFormValues) => {
    const errors: SignupFormValues['errors'] = {};
    if (!values.first_name) {
      errors.first_name = 'Required';
    }
    if (!values.last_name) {
      errors.last_name = 'Required';
    }
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
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
  const handleSignUp = async (values: SignupFormValues, { setSubmitting }: any) => {
    setSubmitting(true);
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      first_name, last_name, email, password1, password2,
    } = values;
    const user = {
      first_name,
      last_name,
      email,
      password1,
      password2,
    };
    await SignUp(user).then((resp) => {
      if (resp.status === 201) {
        if (signupErrorState) {
          setSignupErrorState('');
        }
        setSignedUp(true);
      } else if (resp.response.status === 400) {
        setSubmitting(false);
        const { data } = resp.response;
        if (data.email) {
          setSignupErrorState(data.email.toString());
        } else if (data.non_field_errors) {
          setSignupErrorState(data.non_field_errors.toString());
        } else if (data.password1) {
          setSignupErrorState(data.password1.toString());
        } else if (data.password2) {
          setSignupErrorState(data.password2.toString());
        }
      } else if (resp.response.status === 500) {
        setSignedUp(false);
        setSubmitting(false);
        setSignupErrorState('Server error. Please try again later.');
      } else if (resp.response.status === 429) {
        setSignedUp(false);
        setSubmitting(false);
        setSignupErrorState('Too many requests. Please try again in 24 hours.');
      }
    });
    // todo: add email verification!!
  };
  return (
    <Formik
      initialValues={{
        first_name: '', last_name: '', email: '', password1: '', password2: '',
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        handleSignUp(values, { setSubmitting });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm text-left pl-1
            font-medium text-gray-700 dark:text-gray-300"
            >
              First Name
              <div className="mt-1 relative">
                <Field
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Ye"
                  autoComplete="First Name"
                  required
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                {signupErrorState && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
                </div>
                )}
              </div>

              <ErrorMessage
                name="first_name"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm text-left pl-1
              font-medium text-gray-700 dark:text-gray-300"
            >
              Last Name
              <div className="mt-1 relative">
                <Field
                  id="last_name"
                  name="last_name"
                  type="last_name"
                  placeholder="West"
                  autoComplete="Last Name"
                  required
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                {signupErrorState && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
                </div>
                )}
              </div>

              <ErrorMessage
                name="last_name"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose0"
              />
            </label>
          </div>
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
                {signupErrorState && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
                </div>
                )}
              </div>

              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="password1"
              className="block text-sm text-left pl-1
              font-medium text-gray-700 dark:text-gray-300"
            >
              Password
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
                {signupErrorState && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
                  </div>
                )}
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
              className="block text-sm text-left pl-1
              font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
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
                {signupErrorState && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
                  </div>
                )}
              </div>
              <ErrorMessage
                name="password2"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </label>
          </div>

          <div>
            {!signedUp
              ? (
                <div className="flex justify-center">
                  <PrimaryButton
                    isSubmitting={isSubmitting}
                    wFull
                  >
                    <span className="font-bold text-lg">
                      {isSubmitting ? 'Signing up...' : 'Sign Up'}
                      {' '}
                      <span className="text-xs">✨</span>
                    </span>
                  </PrimaryButton>
                </div>
              )
              : (
                <Link to="/" className="w-full">
                  <span
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md
                    text-sm font-medium text-green-800 bg-green-50 hover:shadow-lg hover:shadow-green-300
                    focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-green-200"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-2 font-bold text-base">
                        <span>
                          Success 🎉!
                        </span>
                        {' '}
                        <span>
                          Click to login.
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
