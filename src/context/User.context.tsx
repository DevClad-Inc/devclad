import React, { useReducer, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { del, get, set } from 'idb-keyval';
import { getUser } from '../services/AuthService';

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

export const UserContext = createContext({} as UserContextState);
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

async function getLocalUser(): Promise<any> {
  const localLoggedInUser = await get('loggedInUser');
  return localLoggedInUser;
}

const localloggedInUser : UserContextState = await getLocalUser();
// convert to UserContextState

export function UserProvider({ children }: UserProviderProps) {
  const [loggedInUser, dispatch] = useReducer(userReducer, { ...initialLoginState });
  const { data, isError, isSuccess } = useQuery(['user'], () => getUser());
  if (Object.values(loggedInUser).every((v) => v === undefined)) {
    // check if idb keyval has a value
    if (localloggedInUser) {
      dispatch({
        type: UserReducerActionTypes.SET_USER_DATA,
        payload: localloggedInUser,
      });
    } else if (isSuccess && data !== null) {
      const userData = data as { data: UserContextState };
      dispatch({
        type: UserReducerActionTypes.SET_USER_DATA,
        payload: userData.data,
      });
      set('loggedInUser', (userData.data));
    }
  }
  if (isError) {
    del('loggedInUser');
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

export async function setIndexDBStore(qc: any) {
  await qc.invalidateQueries(['user']);
  const cacheUserData = qc.getQueryData(['user']) as { data: UserContextState; };
  set('loggedInUser', cacheUserData.data);
}
