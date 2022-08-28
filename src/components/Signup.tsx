import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DevCladLogo from '../assets/devclad.svg';
import { SignupForm } from './forms/AuthForms';
import { Error } from '../utils/Feedback';

function Signup() {
  const [signupError, setSignupError] = useState('');

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-full">
        <img
          className="mx-auto h-24 w-auto"
          src={DevCladLogo}
          alt="DevClad"
        />
        <h1 className="text-center text-4xl mb-10 font-black text-gray-900 dark:text-gray-100">DevClad</h1>
        <h2 className="text-center text-2xl mt-10 font-bold text-gray-700 dark:text-gray-300">Request to Join</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already a member?
          {' '}
          <Link className="font-medium text-orange-700 dark:text-fuchsia-300" to="/">Sign in to DevClad</Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {signupError && (
        <Error error={signupError} />
        )}
        <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm
            signupErrorState={signupError}
            setSignupErrorState={setSignupError}
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
