import React, { useReducer, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser } from './AuthService';

export interface UserContextState {
  pk?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export enum UserReducerActionTypes {
  SET_USER_DATA = 'SET_USER_DATA',
}

interface UserReducerAction {
  type: UserReducerActionTypes;
  payload: UserContextState;
}

export const UserContext = React.createContext({} as UserContextState);
export const UserDispatch = createContext({} as React.Dispatch<any>);

function userReducer(state:UserContextState, action: UserReducerAction): UserContextState {
  const { type, payload } = action;
  switch (type) {
    case UserReducerActionTypes.SET_USER_DATA:
      return {
        ...state,
        ...payload,
        // data: { payload } as UserContextState['data'],
      };
    default:
      return state;
  }
}

const initialLoginState: UserContextState = {
  pk: undefined,
  username: undefined,
  email: undefined,
  first_name: undefined,
  last_name: undefined,
};

interface UserProviderProps {
  children?: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [loggedInUser, dispatch] = useReducer(userReducer, { ...initialLoginState });
  const { data, isError, isSuccess } = useQuery(['user'], () => getUser());
  const localLoggedInUser = JSON.parse(localStorage.getItem('loggedInUser') as string);
  if (Object.values(loggedInUser).every((v) => v === undefined)) {
    if (localLoggedInUser) {
      dispatch({
        type: UserReducerActionTypes.SET_USER_DATA,
        payload: localLoggedInUser,
      });
    } else if (isSuccess && data !== null) {
      const userData = data as { data: UserContextState };
      dispatch({
        type: UserReducerActionTypes.SET_USER_DATA,
        payload: userData.data,
      });
      localStorage.setItem('loggedInUser', JSON.stringify(userData.data));
    }
  }
  if (isError) {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }
  return (
    <UserContext.Provider value={loggedInUser}>
      <UserDispatch.Provider value={dispatch}>{children}</UserDispatch.Provider>
    </UserContext.Provider>
  );
}

UserProvider.defaultProps = {
  children: null,
};

export function useUserDispatch() {
  return useContext(UserDispatch);
}

export function useUserContext() {
  return useContext(UserContext);
}
