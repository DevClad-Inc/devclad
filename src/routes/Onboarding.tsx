import React from 'react';
import { Link, Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import UpdateProfileForm, { AvatarUploadForm } from '@/components/forms/Profile.forms';
import DevCladLogo from '@/assets/devclad.svg';
import { Error, Info, Success, Warning } from '@/lib/Feedback.lib';
import SocialProfileForm from '@/components/forms/SocialProfile.forms';
import { logOut } from '@/services/auth.services';
import { UserStatus, initialUserStatus, initialUserState, User } from '@/lib/InterfacesStates.lib';
import {
  checkProfileEmpty,
  checkSocialProfileEmpty,
  getSocialProfile,
  getStatus,
  setSubmittedStatus,
} from '@/services/profile.services';
import classNames from '@/lib/ClassNames.lib';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import { socialProfileLoader, userQuery } from '@/lib/queriesAndLoaders';
import LoadingCard from '@/components/LoadingCard';

const linkClassesString = `bg-orange-700 dark:bg-orange-900/20 border border-transparent
duration-500 rounded-md py-2 px-4 inline-flex justify-center text-md font-bold dark:text-orange-200`;

export function StepOne() {
  const qc = useQueryClient();
  return (
    <div className="max-w-prose">
      <UpdateProfileForm />
      <AvatarUploadForm />
      <div className="mt-10 flex justify-center p-2">
        <Link
          className="text-md mt-5 inline-flex justify-center
        rounded-md border border-transparent bg-orange-700 py-2
        px-4 font-bold duration-500 dark:bg-orange-900/20 dark:text-orange-200
        "
          to="/onboarding/step-two"
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
  const initialSocialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof socialProfileLoader>>
  >;
  const qc = useQueryClient();
  const checkEmpty: {
    profile: boolean;
    socialProfile: boolean;
  } = { profile: false, socialProfile: false };
  const profileEmptyQuery = useQuery(['profile-empty'], async () => checkProfileEmpty());
  const socialEmptyQuery = useQuery(['social-profile-empty'], async () =>
    checkSocialProfileEmpty()
  );
  let userStatus: UserStatus = { ...initialUserStatus };
  const statusQuery = useQuery(['userStatus'], async () => getStatus());
  if (statusQuery.isSuccess && statusQuery.data !== null) {
    const { data } = statusQuery;
    userStatus = data.data;
  }
  if (profileEmptyQuery.isLoading || socialEmptyQuery.isLoading) {
    return <LoadingCard />;
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
      <SocialProfileForm initialSocialData={initialSocialData} />
      <div className="mt-10 flex justify-between p-2">
        <div className="inline-flex justify-start">
          <Link
            className="text-md inline-flex justify-center rounded-md
        border border-transparent bg-orange-700 py-2 px-4
        font-bold text-white duration-500 dark:bg-orange-900/20 dark:text-orange-200
        "
            to="/onboarding/"
          >
            Back to Step 1
          </Link>
        </div>

        <div className="inline-flex justify-end">
          <button
            type="button"
            className={classNames(
              !checkEmpty.profile || !checkEmpty.socialProfile || userStatus.status === 'Submitted'
                ? 'cursor-not-allowed'
                : '',
              linkClassesString
            )}
            onClick={async () => {
              if (
                checkEmpty.profile &&
                checkEmpty.socialProfile &&
                userStatus.status !== 'Submitted'
              ) {
                try {
                  setSubmittedStatus();
                  toast.custom(<Success success="Submitted request!" />);
                  await qc.invalidateQueries(['userStatus']);
                } catch {
                  toast.custom(<Error error="Something went wrong" />);
                }
              }
            }}
          >
            {!checkEmpty.profile || !checkEmpty.socialProfile
              ? 'Please complete both steps'
              : `${submitText}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Onboarding() {
  useDocumentTitle('Onboarding');
  const navigate = useNavigate();
  const handlelogOut = async () => {
    await logOut().then(() => {
      navigate(0);
    });
  };
  let loggedInUser: User = { ...initialUserState };
  const {
    data: userQueryData,
    isSuccess: userQuerySuccess,
    isLoading: userQueryLoading,
  } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
  }
  let userStatus: UserStatus = { ...initialUserStatus };
  const statusQuery = useQuery(['userStatus'], async () => getStatus());
  if (
    statusQuery.isSuccess &&
    statusQuery.data !== null &&
    Object.values(userStatus).every((value) => value === undefined)
  ) {
    const { data } = statusQuery;
    userStatus = data.data;
  }
  if (userQueryLoading || statusQuery.isLoading) {
    return <LoadingCard />;
  }
  if (userStatus && userStatus.approved) {
    navigate('/');
  }
  if (userStatus && !userStatus.approved) {
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
          dark:stroke-orange-800/20
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
          <h2 className="mt-5 text-center font-display text-3xl font-bold text-neutral-700 dark:text-neutral-300">
            Onboarding
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Hey, {loggedInUser.first_name}. Glad to have you here! {loggedInUser.email} is your
            associated email address.
          </p>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Questions?{' '}
            <a
              className=" text-orange-700 dark:text-orange-300"
              href="https://discord.devclad.com"
              target="_blank"
              rel="noreferrer"
            >
              Ask on our Discord.
            </a>
          </p>
          <div className="text-center text-sm text-neutral-500">
            <button
              onClick={handlelogOut}
              type="button"
              className="mt-5 inline-flex items-center rounded-md border border-transparent bg-mistyRose px-4
              py-2 text-sm text-bloodRed shadow-sm dark:bg-bloodRed/60 dark:text-mistyRose"
            >
              <ArrowLeftOnRectangleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Sign Out
            </button>
          </div>
          <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="w-fit-content mx-auto">
              {userStatus.status === 'Not Submitted' ? (
                <>
                  <Warning warning="Not submitted request to join yet." />
                  <Info info="Tip: Fill out as much as possible for quicker request approval." />
                </>
              ) : (
                <Success success="Request to join submitted. You will be notified once it's processed." />
              )}
            </div>
            <div className="p-5 sm:mx-auto sm:w-full sm:max-w-fit">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <LoadingCard />;
}
