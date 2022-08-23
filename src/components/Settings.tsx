import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/User.context';
import { UpdateUserForm } from './AuthForms';
import { Error } from '../utils/Feedback';

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
      <span className="text-red-500">
        {' '}
        <Link to="/">Go back</Link>
        {' '}
      </span>
    </div>
  );
}

export default Settings;
