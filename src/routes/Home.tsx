import React from 'react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logOut } from '@/services/auth.services';
import { redString } from '@/lib/Buttons.lib';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import useDocumentTitle from '@/lib/useDocumentTitle.lib';
import { userQuery } from '@/lib/queriesAndLoaders';
import useAuth from '@/services/useAuth.services';

function Home(): JSX.Element {
  const qc = useQueryClient();
  let loggedInUser: User = { ...initialUserState };
  const { authed } = useAuth();
  const { data: userQueryData, isSuccess: userQuerySuccess } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
  }
  const navigate = useNavigate();
  const handlelogOut = async () => {
    await logOut().then(() => {
      navigate(0);
    });
  };
  useDocumentTitle('Dashboard');
  React.useEffect(() => {
    if (!authed && qc.getQueryData(['user']) === null) {
      navigate('/login');
    }
  }, [authed]);
  return (
    <div className="mx-auto max-w-full  px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
          {loggedInUser && loggedInUser.first_name}
        </h1>
      </div>
      <br />
      <div className="mx-auto w-3/4 max-w-lg">
        <div className="text-center text-sm text-neutral-500">
          <button onClick={handlelogOut} type="button" className={redString}>
            <ArrowLeftOnRectangleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Home;
