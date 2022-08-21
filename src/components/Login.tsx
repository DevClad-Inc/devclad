import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { getUser, logIn } from '../services/AuthService';
import { UserContextState, useUserDispatch } from '../services/userContext';

interface LoginFormValues {
  email: string;
  password: string;
  errors?: {
    email?: string;
    password?: string;
  }
}

function Login() {
  const [loginError, setLoginError] = useState(false);
  const dispatch = useUserDispatch();

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
    // } else if (values.password.length < 8) {
    //   errors.password = 'Password must be at least 8 characters';
    // }
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
        .then((resp) => {
          const { data } = resp as { data: UserContextState };
          dispatch({
            type: 'SET_USER_DATA',
            payload: data,
          });
          // persist user data in local storage
          localStorage.setItem('loggedInUser', JSON.stringify(data));
        })
        .catch(() => {
          localStorage.removeItem('loggedInUser');
        });
    } catch (error) {
      setLoginError(true);
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-full">
        <img
          className="mx-auto mb-10 h-24 w-auto"
          src="../devclad.svg"
          alt="DevClad"
        />
        <h1 className="mt-6 text-center text-3xl font-bold text-black">Sign In</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or,
          {' '}
          <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            join DevClad now
          </a>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {loginError && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Invalid Email/Password.</h3>
            </div>
          </div>
        </div>
        )}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
              font-medium text-gray-700"
                  >
                    Email
                    <div className="mt-1 relative">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full
                        px-3 py-2 border border-gray-300 rounded-md
                        shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 sm:text-sm"
                      />
                      {loginError && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </label>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm text-left pl-1 font-medium text-gray-700">
                    Password
                    <div className="mt-1 relative">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {loginError && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                      )}
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </label>
                </div>

                <div className="inline-flex items-center">
                  <div className="text-sm">
                    <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </a>
                  </div>

                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span>
                      {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
                      {' '}
                      <span className="text-xs">✨</span>
                    </span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/"
                className="w-full inline-flex
                    justify-center py-2 px-4
                    border border-gray-300 rounded-md
                    shadow-sm bg-white
                    text-sm font-medium
                    text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with GitHub</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
