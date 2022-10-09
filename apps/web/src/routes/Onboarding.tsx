import React from 'react';
import { Link, Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import DevCladLogo from '@devclad/ui/assets/devclad.svg';
import { classNames, useDocumentTitle } from '@devclad/lib';
import UpdateProfileForm, { AvatarUploadForm } from '@/components/forms/Profile.forms';
import { Error, Info, Success, Warning } from '@/components/Feedback';
import { SocialProfileForm } from '@/components/forms/SocialProfile.forms';
import { logOut } from '@/services/auth.services';
import { UserStatus, initialUserStatus, initialUserState, User } from '@/lib/InterfacesStates.lib';
import {
  checkProfileEmpty,
  checkSocialProfileEmpty,
  getStatus,
  setSubmittedStatus,
} from '@/services/profile.services';
import { socialProfileLoader, socialProfileQuery, userQuery } from '@/lib/queriesAndLoaders';
import { ProfileLoading } from '@/components/LoadingStates';

const linkClassesString = `bg-orange-700 dark:bg-orange-900/20 border border-transparent
duration-500 rounded-md py-1 px-6 inline-flex justify-center text-md dark:text-orange-200`;

export function StepOne() {
  const qc = useQueryClient();
  return (
    <div className="max-w-prose">
      <UpdateProfileForm />
      <AvatarUploadForm />
      <div className="mt-10 flex justify-center p-2">
        <Link
          className={linkClassesString}
          to="/onboarding/step-two"
          onMouseEnter={() => {
            qc.prefetchQuery(socialProfileQuery());
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
    return <ProfileLoading />;
  }
  if (profileEmptyQuery.isSuccess && profileEmptyQuery.data) {
    const { data } = profileEmptyQuery;
    const completed = data.data;
    if (completed.is_complete === true) {
      checkEmpty.profile = true;
    }
  }
  if (socialEmptyQuery.isSuccess && socialEmptyQuery.data) {
    const { data } = socialEmptyQuery;
    const completed = data.data;
    if (completed.is_complete === true) {
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
          <Link className={linkClassesString} to="/onboarding/">
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
                await setSubmittedStatus()
                  .then(async () => {
                    toast.custom(<Success success="Submitted request!" />);
                    await qc.refetchQueries(['userStatus']);
                  })
                  .catch(() => {
                    toast.custom(<Error error="Something went wrong" />);
                  });
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
      navigate('/login');
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
    return <ProfileLoading />;
  }
  if (userStatus && userStatus.approved) {
    return <Navigate to="/" />;
  }
  if (userStatus && !userStatus.approved) {
    return (
      <div>
        <div className="backdrop-blur-0">
          <div className="sm:mx-auto sm:w-full sm:max-w-full">
            <img className="mx-auto h-32 w-auto" src={DevCladLogo} alt="DevClad" />
            <h1 className="text-center text-5xl font-black text-neutral-900 dark:text-white">
              DevClad
            </h1>
          </div>
          <h2 className="mt-5 text-center text-3xl text-neutral-700 dark:text-neutral-300">
            Onboarding
          </h2>
          <p className="mt-2 p-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
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
              py-2 text-sm text-bloodRed shadow-sm dark:bg-bloodRed2 dark:text-mistyRose"
            >
              <ArrowLeftOnRectangleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Sign Out
            </button>
          </div>
          <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="w-fit-content mx-auto p-2">
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
  return <ProfileLoading />;
}
