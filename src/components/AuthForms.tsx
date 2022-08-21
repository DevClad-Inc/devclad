import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
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

interface LoginFormProps {
  loginError: boolean;
  setLoginError: (loginError: boolean) => void;
}

// interface SignupFormValues {
//   first_name: string;
//   last_name: string;
//   email: string;
//   password1: string;
//   password2: string;
// }

// interface ForgotPasswordFormValues {
//   email: string;
// }

export function LoginForm({ loginError, setLoginError }:LoginFormProps): JSX.Element {
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
  );
}

export function SignupForm(): JSX.Element {
  return (
    <div>
      <h1>Signup Form</h1>
    </div>
  );
}

export function ForgotPasswordForm(): JSX.Element {
  return (
    <div>
      <h1>Forgot Password Form</h1>
    </div>
  );
}
