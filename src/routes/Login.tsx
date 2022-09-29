import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DevCladLogo from '@/assets/devclad.svg';
import LoginForm from '@/components/forms/Login.forms';
import { Error } from '@/lib/Feedback.lib';
import { PrimaryButton } from '@/lib/Buttons.lib';
import useAuth from '@/services/useAuth.services';

function Login() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [loginError, setLoginError] = useState(false);
  const { authed } = useAuth();
  React.useEffect(() => {
    if (authed && qc.getQueryData(['user'])) {
      navigate('/');
    }
  }, [authed, qc, navigate]);
  return (
    <div>
      <div className="relative mt-5 sm:mt-10">
        <svg
          viewBox="0 0 1090 1090"
          aria-hidden="true"
          fill="none"
          preserveAspectRatio="none"
          width="1090"
          height="1090"
          className="-z-11 absolute left-1/2 h-[788px] -translate-x-1/2 stroke-neutral-300/30
          dark:stroke-orange-800/30
          sm:-top-24 sm:h-auto"
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
          <img className="mx-auto h-32 w-auto" src={DevCladLogo} alt="DevClad" />
          <h1 className="text-center text-5xl font-black text-neutral-900 dark:text-white">
            DevClad
          </h1>
        </div>
        <h2 className="mt-5 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
          Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Not a member?{' '}
          <Link className=" text-orange-700 dark:text-orange-300" to="/signup">
            Join DevClad
          </Link>
        </p>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {loginError && <Error error="Invalid email/password." />}
            <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <LoginForm loginError={loginError} setLoginError={setLoginError} />
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className="bg-white px-2 text-neutral-700
                dark:bg-darkBG dark:text-neutral-300"
                    >
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <PrimaryButton wFull>
                    <svg
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>GitHub</span>
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
