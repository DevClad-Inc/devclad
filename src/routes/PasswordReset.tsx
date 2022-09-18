import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DevCladLogo from '@/assets/devclad.svg';
import PasswordResetForm, { ForgotPasswordForm } from '@/components/forms/ResetPassword.forms';
import useAuth from '@/services/useAuth.services';

export function PassReset() {
  return (
    <>
      <div className="relative mt-5 sm:mt-10">
        <svg
          viewBox="0 0 1090 1090"
          aria-hidden="true"
          fill="none"
          preserveAspectRatio="none"
          width="1090"
          height="1090"
          className="absolute sm:-top-24 left-1/2 -z-11 h-[788px] -translate-x-1/2
          stroke-gray-300/30
          dark:stroke-fuchsia-800/20 sm:h-auto"
        >
          <circle cx="545" cy="545" r="544.5" />
          <circle cx="545" cy="545" r="512.5" />
          <circle cx="545" cy="545" r="480.5" />
          <circle cx="545" cy="545" r="448.5" />
          <circle cx="545" cy="545" r="416.5" />
          <circle cx="545" cy="545" r="384.5" />
          <circle cx="545" cy="545" r="352.5" />
        </svg>
      </div>
      <div className="backdrop-blur-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-full">
          <img
            className="mx-auto h-32 w-auto"
            src={DevCladLogo}
            alt="DevClad"
          />
          <h1 className="text-center text-5xl font-black text-gray-900 dark:text-gray-100">DevClad</h1>
        </div>
        <h2 className="text-center text-2xl mt-5 font-bold text-gray-700 dark:text-gray-300">Reset Password</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link className="font-medium text-orange-700 dark:text-fuchsia-300" to="/">Sign in to DevClad</Link>
        </p>
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <PasswordResetForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ForgotPassword() : JSX.Element {
  const navigate = useNavigate();
  const { authed } = useAuth();

  React.useEffect(() => {
    if (authed) {
      navigate('/settings/password');
    }
  }, [authed, navigate]);
  return (
    <>
      <div className="relative mt-5 sm:mt-10">
        <svg
          viewBox="0 0 1090 1090"
          aria-hidden="true"
          fill="none"
          preserveAspectRatio="none"
          width="1090"
          height="1090"
          className="absolute sm:-top-24 left-1/2 -z-11 h-[788px] -translate-x-1/2
          stroke-gray-300/30
          dark:stroke-fuchsia-800/20 sm:h-auto"
        >
          <circle cx="545" cy="545" r="544.5" />
          <circle cx="545" cy="545" r="512.5" />
          <circle cx="545" cy="545" r="480.5" />
          <circle cx="545" cy="545" r="448.5" />
          <circle cx="545" cy="545" r="416.5" />
          <circle cx="545" cy="545" r="384.5" />
          <circle cx="545" cy="545" r="352.5" />
        </svg>
      </div>
      <div className="backdrop-blur-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-full">
          <img
            className="mx-auto h-32 w-auto"
            src={DevCladLogo}
            alt="DevClad"
          />
          <h1 className="text-center text-5xl font-black text-gray-900 dark:text-gray-100">DevClad</h1>
        </div>
        <h2 className="text-center text-2xl mt-5 font-bold text-gray-700 dark:text-gray-300">Reset Password</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Not a member?
          {' '}
          <Link className="font-medium text-orange-700 dark:text-fuchsia-300" to="/signup">Join DevClad</Link>
        </p>
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}