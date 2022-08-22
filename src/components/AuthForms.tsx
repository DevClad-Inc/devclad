import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { getUser, logIn, SignUp } from '../services/AuthService';
import { UserContextState, UserReducerActionTypes, useUserDispatch } from '../services/userContext';

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
  signupError: boolean;
  setSignupError: (signupError: boolean) => void;
}

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
            type: UserReducerActionTypes.SET_USER_DATA,
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
                  placeholder="work@devclad.com"
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
                  placeholder="••••••••••••••••"
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
                {isSubmitting ? 'Signing...' : 'Sign In'}
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

export function SignupForm({ signupError, setSignupError }:SignupFormProps): JSX.Element {
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
    if (values.password1.length < 16) {
      errors.password1 = 'Password must be at least 16 characters.';
    }
    if ((values.password1 !== values.password2) && (values.password2.length > 0)) {
      errors.password1 = 'Passwords do not match';
      errors.password2 = 'Passwords do not match';
    }
    return errors;
  };

  // setSubmitting typing issue: https://github.com/jaredpalmer/formik/issues/2086
  const handleSignUp = async (values: SignupFormValues, { setSubmitting }: any) => {
    try {
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
      await SignUp(user);
      if (signupError) {
        setSignupError(false);
      }
      // todo: add email verification!!
      setSignedUp(true);
    } catch (error) {
      setSignedUp(false);
      setSignupError(true);
      setSubmitting(false);
    }
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
            font-medium text-gray-700"
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
                  className="appearance-none block w-full
                      px-3 py-2 border border-gray-300 rounded-md
                      shadow-sm placeholder-gray-400
                      focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 sm:text-sm"
                />
                {signupError && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                )}
              </div>

              <ErrorMessage
                name="first_name"
                component="div"
                className="text-sm text-red-400"
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm text-left pl-1
            font-medium text-gray-700"
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
                  className="appearance-none block w-full
                      px-3 py-2 border border-gray-300 rounded-md
                      shadow-sm placeholder-gray-400
                      focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 sm:text-sm"
                />
                {signupError && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>

              <ErrorMessage
                name="last_name"
                component="div"
                className="text-sm text-red-400"
              />
            </label>
          </div>
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
                  placeholder="cactus@jack.com"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full
                      px-3 py-2 border border-gray-300 rounded-md
                      shadow-sm placeholder-gray-400
                      focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 sm:text-sm"
                />
                {signupError && (
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
            <label htmlFor="password1" className="block text-sm text-left pl-1 font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {signupError && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              <ErrorMessage
                name="password1"
                component="div"
                className="text-sm text-red-400"
              />
            </label>
            <p className="mt-2 pl-2 text-sm text-gray-500" id="password-description">
              At least 16 characters.
            </p>
            <p className="mt-2 pl-2 text-xs text-gray-400" id="password-description">
              Tip: Autogenerate a password.
            </p>
          </div>
          <div>
            <label htmlFor="password2" className="block text-sm text-left pl-1 font-medium text-gray-700">
              Confirm Password
              <div className="mt-1 relative">
                <Field
                  id="password2"
                  name="password2"
                  type="password"
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {signupError && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              <ErrorMessage
                name="password2"
                component="div"
                className="text-sm text-red-400"
              />
            </label>
          </div>

          <div>
            {!signedUp
              ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span>
                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    {' '}
                    <span className="text-xs">✨</span>
                  </span>
                </button>
              )
              : (
                <Link to="/login" className="w-full">
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

export function ForgotPasswordForm(): JSX.Element {
  return (
    <div>
      <h1>Forgot Password Form</h1>
    </div>
  );
}
