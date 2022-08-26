import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/User.context';
import { logOut } from '../services/AuthService';

function Home(): JSX.Element {
  const loggedInUser = useUserContext();
  const navigate = useNavigate();
  const handlelogOut = async () => {
    await logOut().then(() => {
      navigate(0);
    });
  };

  return (
    <div className="mx-auto max-w-full  px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">{`Welcome, ${loggedInUser.first_name}`}</h1>
      </div>
      <br />
      <div className="mx-auto w-3/4 max-w-lg">
        <div className="text-center text-sm text-gray-500">
          <button
            onClick={handlelogOut}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-bloodRed hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Home;
