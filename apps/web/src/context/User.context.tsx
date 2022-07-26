import React, { useReducer, createContext, useContext } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { delMany } from 'idb-keyval';
import getsetIndexedDB from '@/lib/getsetIndexedDB.lib';
import { Profile, User } from '@/lib/types.lib';
import { tokenQuery, userQuery } from '@/lib/queries.lib';
import { checkTokenType } from '@/services/auth.services';

export enum UserReducerActionTypes {
	SET_USER_DATA = 'SET_USER_DATA',
}

interface UserReducerAction {
	type: UserReducerActionTypes;
	payload: User;
}

export const UserContext = createContext({} as User);
export const UserDispatch = createContext({} as React.Dispatch<UserReducerAction>);

function userReducer(state: User, action: UserReducerAction): User {
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

interface UserProviderProps {
	children?: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
	const [loggedInUser, dispatch] = useReducer(userReducer, {});
	const { data: token } = useQuery(tokenQuery());
	const { data, isError, isSuccess } = useQuery({
		...userQuery(token || ''),
		enabled: checkTokenType(token),
	});
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

export async function invalidateAndStoreIDB(qc: QueryClient, key: string) {
	// idk why i made this, was using it to store user data in idb,
	// still storing but that data is not used anywhere essential
	await qc.refetchQueries([key]);
	if (key === 'user') {
		const cacheUserData = qc.getQueryData([key]) as { data: User };
		if (cacheUserData) {
			getsetIndexedDB<User>('loggedInUser', 'set', cacheUserData.data);
		}
	} else if (key === 'profile') {
		const cacheProfileData = qc.getQueryData([key]) as { data: Profile };
		if (cacheProfileData) {
			getsetIndexedDB<Profile>('profile', 'set', cacheProfileData.data);
		}
	}
}
