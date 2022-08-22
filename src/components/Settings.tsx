import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useMutation, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUserContext, useUserDispatch } from '../services/userContext';

const API_URL = import.meta.env.VITE_API_URL;

interface UpdateUserValues {
  firstName?: string;
  lastName?: string;
  username?: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
}

export async function updateUser(first_name?: string, last_name?: string, username?: string) {
  const token = localStorage.getItem('token');
  if (token) {
    // method signature is not working for some reason, idk wtf is wrong with axios
    // using axios by passing config instead
    return axios({
      method: 'PATCH',
      url: `${API_URL}/auth/user/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        first_name,
        last_name,
        username,
      },
    });
  }
  return null;
}

function Settings(): JSX.Element {
  const loggedInUser = useUserContext();
  const { pk, email } = loggedInUser;
  const dispatch = useUserDispatch();
  const validate = (values: UpdateUserValues) => {
    const errors: UpdateUserValues['errors'] = {};
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
  const handleSubmit = async (values: UpdateUserValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const { firstName, lastName } = values;
      let { username } = values;
      if (username === loggedInUser.username) {
        username = undefined;
      }
      await updateUser(firstName, lastName, username)
        .then(() => {
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
          localStorage.removeItem('loggedInUser');
        });
    } catch (error) {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <h1>
        {`Settings for ${loggedInUser.first_name}`}
        {' '}
      </h1>
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
            <Field type="text" name="firstName" placeholder="First Name" />
            <ErrorMessage name="firstName" component="div" />
            <Field type="text" name="lastName" placeholder="Last Name" />
            <ErrorMessage name="lastName" component="div" />
            <Field type="text" name="username" placeholder="Username" />
            <ErrorMessage name="username" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Settings;
