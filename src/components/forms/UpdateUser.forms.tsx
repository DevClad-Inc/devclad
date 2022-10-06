import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import { del } from 'idb-keyval';
import { invalidateAndStoreIDB } from '@/context/User.context';
import { updateUser } from '@/services/auth.services';
import { User, initialUserState, UpdateUserFormValues } from '@/lib/InterfacesStates.lib';
import { PrimaryButton } from '@/lib/Buttons.lib';
import { Success, Error } from '@/components/Feedback';
import { userQuery } from '@/lib/queriesAndLoaders';
import { ProfileLoading } from '../LoadingStates';

// only first name, last name, and username can be updated via this form
export default function UpdateUserForm(): JSX.Element {
  let loggedInUser: User = { ...initialUserState };
  const {
    data: userQueryData,
    isSuccess: userQuerySuccess,
    isLoading: userQueryLoading,
  } = useQuery(userQuery());
  if (userQuerySuccess && userQueryData !== null) {
    loggedInUser = userQueryData.data;
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
  const handleSubmit = async (
    values: UpdateUserFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true);
      const { firstName, lastName } = values;
      let { username } = values;
      if (username === loggedInUser.username) {
        username = undefined;
      }
      await updateUser(firstName, lastName, username).then(async () => {
        del('loggedInUser');
        if (username === undefined) {
          username = loggedInUser.username;
        }
        setSubmitting(false);
        invalidateAndStoreIDB(qc, 'user');
        toast.custom(<Success success="User updated successfully" />, {
          id: 'user-update-success',
        });
      });
    } catch (error: any) {
      const { data } = error.response;
      if (data.username) {
        toast.custom(<Error error={data.username} />, {
          id: 'user-update-username-error',
        });
      } else {
        toast.custom(<Error error="Check First and Last Name" />, {
          id: 'user-update-name-error',
        });
      }
      setSubmitting(false);
    }
  };
  if (userQueryLoading) {
    return <ProfileLoading />;
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
                className="text-md block
                 text-neutral-700 dark:text-neutral-300"
              >
                First Name
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  className="mt-1 block w-full rounded-md border border-neutral-300
                    py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 dark:bg-darkBG sm:text-sm"
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
                className="text-md block
                 text-neutral-700 dark:text-neutral-300"
              >
                Last Name
                <Field
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  className="mt-1 block w-full rounded-md border border-neutral-300
                    py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 dark:bg-darkBG sm:text-sm"
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
                className="text-md block  text-neutral-700 dark:text-neutral-300"
              >
                Username
                <Field
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                  className="mt-1 block w-full rounded-md border border-neutral-300
                    py-2 px-3 shadow-sm focus:outline-none dark:border-neutral-800 dark:bg-darkBG sm:text-sm"
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
            <PrimaryButton isSubmitting={isSubmitting}>
              <span className="text-sm">Save</span>
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
