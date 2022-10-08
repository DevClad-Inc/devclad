import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { delMany } from 'idb-keyval';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { getUser, logIn } from '@/services/auth.services';
import { invalidateAndStoreIDB } from '@/context/User.context';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { LoginFormValues } from '@/lib/InterfacesStates.lib';
import { streamQuery } from '@/lib/queriesAndLoaders';

interface LoginFormProps {
  loginError: boolean;
  setLoginError: (loginError: boolean) => void;
}

export default function LoginForm({ loginError, setLoginError }: LoginFormProps): JSX.Element {
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
  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
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
          qc.refetchQueries(['userStatus']);
        })
        .catch(() => {
          delMany(['loggedInUser', 'profile']);
        });
      qc.fetchQuery(streamQuery());
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
              className="block pl-1 text-left text-sm
           text-neutral-700 dark:text-neutral-300"
            >
              Email
              <div className="relative mt-1">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="work@devclad.com"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full rounded-md border border-neutral-300
                  py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 dark:bg-darkBG sm:text-sm"
                />
                {loginError && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationTriangleIcon
                      className="h-5 w-5 text-bloodRed dark:text-mistyRose"
                      aria-hidden="true"
                    />
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
              className="block pl-1 text-left text-sm
           text-neutral-700 dark:text-neutral-300"
            >
              Password
              <div className="relative mt-1">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full rounded-md border border-neutral-300
                  py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 dark:bg-darkBG sm:text-sm"
                />
                {loginError && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationTriangleIcon
                      className="h-5 w-5 text-bloodRed dark:text-mistyRose"
                      aria-hidden="true"
                    />
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
              <Link to="/forgot-password" className=" text-orange-700 dark:text-orange-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="flex w-full justify-center">
            <PrimaryButton isSubmitting={isSubmitting} wFull>
              <span className="w-full">
                {isSubmitting ? 'Signing In...' : 'Sign In'} <span>✨</span>
              </span>
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}