import React, { createContext } from 'react';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import { useAuth } from '@/services/useAuth.services';
import { Profile } from '@/lib/InterfacesStates.lib';
import { Error } from '@/components/Feedback';
import { useProfile } from '@/services/socialHooks.services';

interface StreamProviderProps {
	children?: React.ReactNode;
}

interface StreamContextInterface {
	client: StreamChat;
	connected: boolean;
	toggleConnection: (connected: boolean) => void;
}

export const StreamContext = createContext({} as StreamContextInterface);

export function StreamProvider({ children }: StreamProviderProps) {
	const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY as string);
	const [connected, setConnected] = React.useState(false);
	const { loggedInUser, streamToken } = useAuth();
	const profileData = useProfile(loggedInUser.username as string) as Profile;

	if (loggedInUser && streamToken && !connected) {
		const connect = async () => {
			setConnected(true);
			await client
				.connectUser(
					{
						id: streamToken?.uid as string,
						first_name: loggedInUser.first_name as string,
						last_name: loggedInUser.last_name as string,
						username: loggedInUser.username as string,
						email: loggedInUser.email as string,
						image: profileData?.avatar as string,
					},
					streamToken?.token as string
				)
				.then(() => {
					// console.log('connected to stream');
				})
				.catch(() => {
					// console.log(err);
					setConnected(false);
					toast.custom(
						<Error error="Cannot connect to Stream. Try refreshing the page." />,
						{
							id: 'stream-connect-error',
						}
					);
				});
		};
		if (connected === false) {
			connect();
		}
	}

	const toggleConnection = (conn: boolean) => {
		setConnected(conn);
	};
	const value = React.useMemo(
		() => ({ client, connected, toggleConnection }),
		[client, connected]
	);
	return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

StreamProvider.defaultProps = {
	children: null,
};

export const useStreamContext = () => {
	const context = React.useContext(StreamContext);
	return context;
};

export default StreamProvider;
