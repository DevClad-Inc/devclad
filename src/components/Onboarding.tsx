import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import UpdateProfileForm, { AvatarUploadForm } from '@/components/forms/Profile.forms';
import DevCladLogo from '@/assets/devclad.svg';
import {
  Error, Info, Success, Warning,
} from '@/lib/Feedback.lib';
import SocialProfileForm from '@/components/forms/SocialProfile.forms';
import {
  getUser, logOut,
} from '@/services/auth.services';
import {
  UserStatus, initialUserStatus, initialUserState, User,
} from '@/lib/InterfacesStates.lib';
import {
  checkProfileEmpty, checkSocialProfileEmpty,
  getSocialProfile, getStatus, setSubmittedStatus,
} from '@/services/profile.services';
import classNames from '@/lib/ClassNames.lib';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';

const linkClassesString = `bg-orange-700 dark:bg-fuchsia-900/30 border border-transparent
duration-500 rounded-md py-2 px-4 inline-flex justify-center text-md font-bold dark:text-fuchsia-200`;

export function StepOne() {
  const qc = useQueryClient();
  return (
    <div className="max-w-prose">
      <UpdateProfileForm />
      <AvatarUploadForm />
      <div className="p-2 mt-10 flex justify-center">
        <Link
          className="mt-5 border border-transparent bg-orange-700
        dark:bg-fuchsia-900/30 duration-500 rounded-md py-2 px-4
        inline-flex justify-center text-md font-bold dark:text-fuchsia-200
        "
          to="/step-two"
          onMouseEnter={() => {
            qc.prefetchQuery(['social-profile'], () => getSocialProfile());
          }}
        >
          Proceed to Step 2

        </Link>
      </div>
    </div>
  );
}

export function StepTwo() {
  const qc = useQueryClient();
  const checkEmpty: {
    profile: boolean; socialProfile: boolean
  } = { profile: false, socialProfile: false };
  const profileEmptyQuery = useQuery(['profile-empty'], () => checkProfileEmpty());
  const socialEmptyQuery = useQuery(['social-profile-empty'], () => checkSocialProfileEmpty());
  let userStatus: UserStatus = { ...initialUserStatus };
  const statusQuery = useQuery(['userStatus'], () => getStatus());
  if ((statusQuery.isSuccess && statusQuery.data !== null)
  && Object.values(userStatus).every((value) => value === undefined)) {
    const { data } = statusQuery;
    userStatus = data.data;
  }
  if (profileEmptyQuery.isLoading || socialEmptyQuery.isLoading) {
    return (
      <div> Loading... </div>
    );
  }
  if (profileEmptyQuery.isSuccess && profileEmptyQuery.data) {
    const { data } = profileEmptyQuery;
    const completed = data.data;
    if (completed.complete === true) {
      checkEmpty.profile = true;
    }
  }
  if (socialEmptyQuery.isSuccess && socialEmptyQuery.data) {
    const { data } = socialEmptyQuery;
    const completed = data.data;
    if (completed.complete === true) {
      checkEmpty.socialProfile = true;
    }
  }
  let submitText = 'Submit Request';
  if (userStatus && userStatus.status === 'Submitted') {
    submitText = 'Submitted Request';
  }

  return (
    <div className="max-w-5xl">
      <SocialProfileForm />
      <div className="p-2 mt-10 justify-between flex">
        <div className="inline-flex justify-start">
          <Link
            className="border border-transparent bg-orange-700 text-white
        dark:bg-fuchsia-900/30 duration-500 rounded-md py-2 px-4
        inline-flex justify-center text-md font-bold dark:text-fuchsia-200
        "
            to="/"
          >
            Back to Step 1

          </Link>
        </div>

        <div className="inline-flex justify-end">
          <button
            type="button"
            className={classNames(
              (!checkEmpty.profile || !checkEmpty.socialProfile || userStatus.status === 'Submitted')
                ? 'cursor-not-allowed'
                : '',
              linkClassesString,
            )}
            onClick={async () => {
              if (checkEmpty.profile && checkEmpty.socialProfile && userStatus.status !== 'Submitted') {
                try {
                  setSubmittedStatus();
                  toast.custom(
                    <Success success="Submitted request!" />,
                  );
                  await qc.invalidateQueries(['userStatus']);
                } catch {
                  toast.custom(
                    <Error error="Something went wrong" />,
                  );
                }
              }
            }}
          >
            {(!checkEmpty.profile || !checkEmpty.socialProfile) ? 'Please complete both steps' : `${submitText}`}
          </button>
        </div>
      </div>
    </div>

  );
}

export function Onboarding() {
  useDocumentTitle('Onboarding');
  let loggedInUser: User = { ...initialUserState };
  const userQuery = useQuery(['user'], () => getUser());
  if (userQuery.isSuccess && userQuery.data !== null) {
    const { data } = userQuery;
    loggedInUser = data.data;
  }
  let userStatus: UserStatus = { ...initialUserStatus };
  const statusQuery = useQuery(
    ['userStatus'],
    () => getStatus(),
  );
  if ((statusQuery.isSuccess && statusQuery.data !== null)
  && Object.values(userStatus).every((value) => value === undefined)) {
    const { data } = statusQuery;
    userStatus = data.data;
  }
  if (userQuery.isLoading || statusQuery.isLoading) {
    return (
      <div>Loading...</div>
    );
  }
  const navigate = useNavigate();
  const handlelogOut = async () => {
    await logOut().then(() => {
      navigate(0);
    });
  };
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
          <h1 className="text-center text-5xl font-black text-gray-900 dark:text-white">DevClad</h1>
        </div>
        <h2 className="font-display text-center text-3xl mt-5 font-bold text-gray-700 dark:text-gray-300">Onboarding</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Hey,
          {' '}
          {loggedInUser.first_name}
          . Glad to have you here!
          {' '}
          {loggedInUser.email}
          {' '}
          is your associated email address.
        </p>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Questions?
          {' '}
          <a
            className="font-medium text-orange-700 dark:text-fuchsia-300"
            href="https://discord.devclad.com"
            target="_blank"
            rel="noreferrer"
          >
            Ask on our Discord.

          </a>
          <div className="text-center text-sm text-gray-500">
            <button
              onClick={handlelogOut}
              type="button"
              className="mt-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium
              rounded-md shadow-sm text-bloodRed bg-mistyRose dark:text-mistyRose dark:bg-bloodRed/60"
            >
              <ArrowLeftOnRectangleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </p>
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="w-fit-content mx-auto">
            {userStatus.status === 'Not Submitted' ? (
              <>
                <Warning warning="Not submitted request to join yet." />
                <Info info="Tip: Fill out as much as possible for quicker request approval." />
              </>
            )
              : <Success success="Request to join submitted. You will be notified once it's processed." />}
          </div>
          <div className="sm:mx-auto p-5 sm:w-full sm:max-w-fit">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
