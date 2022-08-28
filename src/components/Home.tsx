import React from 'react';
import { useNavigate } from 'react-router-dom';
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-bloodRed bg-mistyRose dark:text-mistyRose dark:bg-bloodRed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Home;
