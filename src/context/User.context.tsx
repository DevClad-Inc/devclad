import React, { useReducer, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
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
export interface Profile {
  'uid'?: string;
  'timezone'?: string;
  'avatar'?: string;
  'pronouns'?: string;
  'about'?: string;
  'website'?: string;
  'linkedin'?: string;
  'languages'?: string;
  'dev_type'?: string;
  'raw_xp'?: number;
  'age_range'?: string;
  'purpose'?: string;
  'location'?: string;
}

export const initialProfileState : Profile = {
  uid: undefined,
  timezone: undefined,
  avatar: undefined,
  pronouns: undefined,
  about: undefined,
  website: undefined,
  linkedin: undefined,
  languages: undefined,
  dev_type: undefined,
  raw_xp: undefined,
  age_range: undefined,
  purpose: undefined,
  location: undefined,
};
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
/*
async function getLocalUser(): Promise<any> {
  const localLoggedInUser = await get('loggedInUser');
  return localLoggedInUser;
}

const localloggedInUser : UserContextState = await getLocalUser();

*/

export function UserProvider({ children }: UserProviderProps) {
  const [loggedInUser, dispatch] = useReducer(userReducer, { ...initialLoginState });
  const { data, isError, isSuccess } = useQuery(['user'], () => getUser());
  if (Object.values(loggedInUser).every((v) => v === undefined)) {
    if (isSuccess && data !== null) {
      const userData = data as { data: UserContextState };
      dispatch({
        type: UserReducerActionTypes.SET_USER_DATA,
        payload: userData.data,
      });
    }
  }
  if (isError) {
    // delMany(['loggedInUser', 'profile']);
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

/*
export async function setIndexDBStore(qc: any, key: string) {
  await qc.invalidateQueries([key]);
  if (key === 'user') {
    const cacheUserData = qc.getQueryData([key]) as { data: UserContextState };
    set('loggedInUser', cacheUserData.data);
  } else if (key === 'profile') {
    const cacheProfileData = qc.getQueryData([key]) as { data: Profile };
    set('profile', cacheProfileData.data);
  }
}
*/
