import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/User.context';
import { UpdateUserForm } from './forms/AuthForms';
import { Error } from '../utils/Feedback';
import ToggleTheme from './ToggleTheme';

function Settings(): JSX.Element {
  const loggedInUser = useUserContext();
  const [updateUserError, setUpdateUserError] = React.useState('');
  return (
    <div>
      <h1>
        {`Settings for ${loggedInUser.first_name}`}
        {' '}
      </h1>
      {updateUserError && (
        <Error error={updateUserError} />
      )}
      <UpdateUserForm
        updateErrorState={updateUserError}
        setUpdateErrorState={setUpdateUserError}
      />
      <span className="text-bloodRed dark:text-mistyRose">
        {' '}
        <Link to="/">Go back</Link>
        {' '}
      </span>
      <div className="flex items-center justify-center">
        <ToggleTheme />
      </div>
    </div>
  );
}

export default Settings;
