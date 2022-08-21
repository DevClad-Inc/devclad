import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../services/userContext';
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
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-black sm:text-3xl">{`Welcome, ${loggedInUser.username}`}</h1>
      </div>
      <br />
      <div className="mx-auto w-1/2 max-w-lg">
        <div className="text-center text-sm text-gray-500">
          <p className="mt-6 mb-0 space-y-4 rounded-xl p-8 shadow-2xl">
            You are now logged in.
          </p>
        </div>
      </div>
      <div className="mx-auto w-1/2 max-w-lg">
        <div className="text-center text-sm text-gray-500">
          <p className="mt-6 mb-0 space-y-4 rounded-xl p-8 shadow-2xl">
            <Link to="/settings" className="text-blue-500 hover:text-blue-700">
              Go to settings
            </Link>
            {' '}
            OR
            {' '}
            <button
              type="button"
              onClick={handlelogOut}
              className="text-blue-500 hover:text-blue-700"
            >
              Log out
            </button>
          </p>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Home;
