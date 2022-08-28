import { useQueryClient } from '@tanstack/react-query';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { del } from 'idb-keyval';
import React from 'react';
import { useUserContext, useUserDispatch, setIndexDBStore } from '../../context/User.context';
import { updateUser } from '../../services/AuthService';
import { PrimaryButton } from '../../utils/Buttons';

interface UpdateProfileFormProps {
  updateErrorState: string;
  setUpdateErrorState: (updateErrorState: string) => void;
}

// only first name, last name, and username can be updated via this form
export default function UpdateProfileForm({
  updateErrorState,
  setUpdateErrorState,
}: UpdateProfileFormProps): JSX.Element {
  const loggedInUser = useUserContext();
  const { pk, email } = loggedInUser;
  const dispatch = useUserDispatch();
  const qc = useQueryClient();
  const validate = (values: UpdateProfileFormValues) => {
    const errors: UpdateProfileFormProps['errors'] = {};
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
  const handleSubmit = async (values: UpdateProfileFormValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const { firstName, lastName } = values;
      let { username } = values;
      if (username === loggedInUser.username) {
        username = undefined;
      }
      await updateUser(firstName, lastName, username)
        .then(async () => {
          if (updateErrorState) {
            setUpdateErrorState('');
          }
          del('loggedInUser');
          if (username === undefined) {
            username = loggedInUser.username;
          }
          setSubmitting(false);
          dispatch({
            type: 'SET_USER_DATA',
            payload: {
              pk,
              username,
              email,
              first_name: firstName,
              last_name: lastName,
            },
          });
          await setIndexDBStore(qc, 'user');
        });
    } catch (error: any) {
      const { data } = error.response;
      if (data.username) {
        setUpdateErrorState(data.username);
      } else {
        setUpdateErrorState('Check First Name and Last Name');
      }
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={{
        firstName: loggedInUser.first_name,
        lastName: loggedInUser.last_name,
        username: loggedInUser.username,
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
                className="block text-sm font-medium
                 text-gray-700 dark:text-gray-300"
              >
                First name
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First name"
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
                className="block text-sm font-medium
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
