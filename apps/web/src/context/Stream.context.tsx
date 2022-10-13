import React, { createContext } from 'react';
import { StreamChat } from 'stream-chat';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '@/services/useAuth.services';
import { initialProfileState, Profile } from '@/lib/InterfacesStates.lib';
import { profileQuery } from '@/lib/queriesAndLoaders';
import { Error } from '@/components/Feedback';

interface StreamProviderProps {
	children?: React.ReactNode;
}

interface StreamContextInterface {
	client: StreamChat;
	connected: boolean;
}

export const StreamContext = createContext({} as StreamContextInterface);

export function StreamProvider({ children }: StreamProviderProps) {
	const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY as string);
	const connected = React.useRef(false);
	const { loggedInUser, streamToken } = useAuth();
	let profileData: Profile = { ...initialProfileState };
	const { data: profileQueryData, isSuccess: profileQuerySuccess } = useQuery({
		...profileQuery(),
	});
	if (profileQuerySuccess && profileQueryData !== null) {
		profileData = profileQueryData.data;
	}

	if (loggedInUser && streamToken && !connected.current) {
		const connect = async () => {
			connected.current = true;
			await client
				.connectUser(
					{
						id: streamToken?.uid as string,
						first_name: loggedInUser.first_name as string,
						last_name: loggedInUser.last_name as string,
						username: loggedInUser.username,
						email: loggedInUser.email,
						image: profileData.avatar as string,
					},
					streamToken?.token as string
				)
				.then(() => {
					// console.log('connected to stream');
				})
				.catch(() => {
					// console.log(err);
					connected.current = false;
					toast.custom(<Error error="Cannot connect to Stream. Try refreshing the page." />, {
						id: 'stream-connect-error',
					});
				});
		};
		if (connected.current === false) {
			connect();
		}
	}
	const value = React.useMemo(
		() => ({ client, connected: connected.current }),
		[client, connected]
	);
	return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

StreamProvider.defaultProps = {
	children: null,
};

export default StreamProvider;
