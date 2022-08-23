import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DevCladLogo from '../assets/devclad.svg';
import { LoginForm } from './AuthForms';
import { Error } from '../utils/Feedback';

function Login() {
  const [loginError, setLoginError] = useState(false);

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-full">
        <img
          className="mx-auto h-24 w-auto"
          src={DevCladLogo}
          alt="DevClad"
        />
        <h1 className="text-center text-4xl mb-10 font-black text-gray-900">DevClad</h1>
        <h2 className="text-center text-2xl mt-10 font-bold text-gray-700">Sign In</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Not a member?
          {' '}
          <Link className="font-medium text-indigo-600 hover:text-indigo-500" to="/signup">Join DevClad</Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

        {loginError && (
        <Error error="Invalid email/password." />
        )}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm loginError={loginError} setLoginError={setLoginError} />
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
