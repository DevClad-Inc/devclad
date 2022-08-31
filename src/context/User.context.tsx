import React, { useReducer, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { delMany, set } from 'idb-keyval';
import getsetIndexedDB from '../utils/getsetIndexedDB';
import { getUser } from '../services/AuthService';
import { Profile } from '../utils/InterfacesStates.utils';

export interface User {
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
  payload: User;
}

export const UserContext = createContext({} as User);
export const UserDispatch = createContext({} as React.Dispatch<any>);

function userReducer(state:User, action: UserReducerAction): User {
  const { type, payload } = action;
  switch (type) {
    case UserReducerActionTypes.SET_USER_DATA:
      return {
        ...state,
        ...payload,
        // data: { payload } as User['data'],
      };
    default:
      return state;
  }
}

export const initialUserState: User = {
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
  const [loggedInUser, dispatch] = useReducer(userReducer, { ...initialUserState });
  const { data, isError, isSuccess } = useQuery(['user'], () => getUser());
  if (Object.values(loggedInUser).every((v) => v === undefined)) {
    getsetIndexedDB('loggedInUser', 'get').then((localUser) => {
      if (localUser) {
        dispatch({
          type: UserReducerActionTypes.SET_USER_DATA,
          payload: localUser,
        });
      } else if (isSuccess && data !== null) {
        const userData = data as { data: User };
        dispatch({
          type: UserReducerActionTypes.SET_USER_DATA,
          payload: userData.data,
        });
        getsetIndexedDB<User>('loggedInUser', 'set', userData.data);
      }
    });
  }
  if (isError) {
    delMany(['loggedInUser', 'profile']);
    Cookies.remove('token');
    Cookies.remove('refresh');
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

export async function setIndexDBStore(qc: any, key: string) {
  await qc.refetchQueries([key]);
  if (key === 'user') {
    const cacheUserData = qc.getQueryData([key]) as { data: User };
    set('loggedInUser', cacheUserData.data);
  } else if (key === 'profile') {
    const cacheProfileData = qc.getQueryData([key]) as { data: Profile };
    set('profile', cacheProfileData.data);
  }
}
