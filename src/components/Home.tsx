import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logOut } from '../services/auth.services';
import { redString } from '../utils/Buttons.utils';
import { User, initialUserState } from '../utils/InterfacesStates.utils';
import useDocumentTitle from '../utils/useDocumentTitle';

function Home(): JSX.Element {
  let loggedInUser: User = { ...initialUserState };
  const userQuery = useQuery(['user'], () => getUser());
  if (userQuery.isSuccess && userQuery.data !== null) {
    const { data } = userQuery;
    loggedInUser = data.data;
  }
  const navigate = useNavigate();
  const handlelogOut = async () => {
    await logOut().then(() => {
      navigate(0);
    });
  };
  useDocumentTitle('Dashboard');

  return (
    <div className="mx-auto max-w-full  px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
          {loggedInUser && loggedInUser.first_name}
        </h1>
      </div>
      <br />
      <div className="mx-auto w-3/4 max-w-lg">
        <div className="text-center text-sm text-gray-500">
          <button
            onClick={handlelogOut}
            type="button"
            className={redString}
          >
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
