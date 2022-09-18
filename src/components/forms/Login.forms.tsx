import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { delMany } from 'idb-keyval';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import {
  getUser, logIn,
} from '@/services/auth.services';
import {
  invalidateAndStoreIDB,
} from '@/context/User.context';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { LoginFormValues } from '@/lib/InterfacesStates.lib';

interface LoginFormProps {
  loginError: boolean;
  setLoginError: (loginError: boolean) => void;
}

export default function LoginForm({ loginError, setLoginError }:LoginFormProps): JSX.Element {
  const qc = useQueryClient();
  const validate = (values: LoginFormValues) => {
    const errors: LoginFormValues['errors'] = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  };
    // setSubmitting typing issue: https://github.com/jaredpalmer/formik/issues/2086
  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const { email, password } = values;
      await logIn(email, password);

      if (loginError) {
        setLoginError(false);
      }
      await getUser()
        .then(() => {
          invalidateAndStoreIDB(qc, 'user');
        })
        .catch(() => {
          delMany(['loggedInUser', 'profile']);
        });
    } catch (error) {
      setLoginError(true);
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, { setSubmitting });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6" action="#" method="POST">
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
                  placeholder="work@devclad.com"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                {loginError && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationTriangleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
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
              htmlFor="password"
              className="block text-sm text-left pl-1
          font-medium text-gray-700 dark:text-gray-300"
            >
              Password
              <div className="mt-1 relative">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                  dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                {loginError && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationTriangleIcon className="h-5 w-5 text-bloodRed dark:text-mistyRose" aria-hidden="true" />
                </div>
                )}
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-bloodRed dark:text-mistyRose"
              />
            </label>
          </div>

          <div className="inline-flex items-center">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-orange-700 dark:text-fuchsia-300">
                Forgot your password?
              </Link>
            </div>

          </div>

          <div className="w-full flex justify-center">
            <PrimaryButton isSubmitting={isSubmitting} wFull>
              <span className="w-full">
                {isSubmitting ? 'Signing...' : 'Sign In'}
                {' '}
                <span className="text-xs">✨</span>
              </span>
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
