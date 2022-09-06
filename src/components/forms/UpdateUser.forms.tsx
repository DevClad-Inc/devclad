import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import toast from 'react-hot-toast';
import { del } from 'idb-keyval';
import { setIndexDBStore } from '../../context/User.context';
import { getUser, updateUser } from '../../services/auth.services';
import { User, initialUserState } from '../../utils/InterfacesStates.utils';
import { PrimaryButton } from '../../utils/Buttons.utils';
import { Success, Error } from '../../utils/Feedback.utils';

interface UpdateUserFormValues {
  /* why are some of these values optional?
    when logged out, useUserContext is set to undefined for values of user.
    Hence, User has optional values.
    UpdateUserValues accomodates loggedInUser for optional values.
    Hence, UpdateUserValues has optional values too.
    */
  firstName?: string;
  lastName?: string;
  username?: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
}

// only first name, last name, and username can be updated via this form
export default function UpdateUserForm(): JSX.Element {
  let loggedInUser: User = { ...initialUserState };
  const userQuery = useQuery(['user'], () => getUser());
  if (userQuery.isSuccess && userQuery.data !== null) {
    const { data } = userQuery;
    loggedInUser = data.data;
  }
  const qc = useQueryClient();
  const validate = (values: UpdateUserFormValues) => {
    const errors: UpdateUserFormValues['errors'] = {};
    if (!values.firstName) {
      errors.firstName = 'Required';
    }
    if (!values.lastName) {
      errors.lastName = 'Required';
    }
    if (!values.username) {
      errors.username = 'Required';
    }
    return errors;
  };
  const handleSubmit = async (values: UpdateUserFormValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const { firstName, lastName } = values;
      let { username } = values;
      if (username === loggedInUser.username) {
        username = undefined;
      }
      await updateUser(firstName, lastName, username)
        .then(async () => {
          del('loggedInUser');
          if (username === undefined) {
            username = loggedInUser.username;
          }
          setSubmitting(false);
          setIndexDBStore(qc, 'user');
          toast.custom(
            <Success success="User updated successfully" />,
            {
              id: 'user-update-success',
            },
          );
        });
    } catch (error: any) {
      const { data } = error.response;
      if (data.username) {
        toast.custom(
          <Error error={data.username} />,
          {
            id: 'user-update-username-error',
          },
        );
      } else {
        toast.custom(
          <Error error="Check First and Last Name" />,
          {
            id: 'user-update-name-error',
          },
        );
      }
      setSubmitting(false);
    }
  };
  if (userQuery.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Formik
      initialValues={{
        firstName: loggedInUser && loggedInUser.first_name,
        lastName: loggedInUser && loggedInUser.last_name,
        username: loggedInUser && loggedInUser.username,
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, { setSubmitting });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="firstName"
                className="block text-md font-medium
                 text-gray-700 dark:text-gray-300"
              >
                First name
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="lastName"
                className="block text-md font-medium
                 text-gray-700 dark:text-gray-300"
              >
                Last name
                <Field
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
              </label>
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-md font-medium text-gray-700 dark:text-gray-300"
              >
                Username
                <Field
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                  className="mt-1 block w-full dark:bg-raisinBlack2 border border-gray-300
                    dark:border-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:outline-none"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-bloodRed dark:text-mistyRose"
                />
              </label>
            </div>
          </div>
          <div className="px-4 py-3 text-right sm:px-6">
            <PrimaryButton
              isSubmitting={isSubmitting}
            >
              Save
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
