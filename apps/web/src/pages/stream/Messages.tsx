import React from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import {
	PaperClipIcon,
	PaperAirplaneIcon,
	ChevronDoubleDownIcon,
} from '@heroicons/react/24/outline';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Channel, DefaultGenerics, StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import { classNames, useDocumentTitle } from '@devclad/lib';
import { useCircle, useConnected, useProfile, useStreamUID } from '@/services/socialHooks.services';
import { useAuth } from '@/services/useAuth.services';
import { Profile } from '@/lib/types.lib';
import { MessagesLoading } from '@/components/LoadingStates';
import { Error } from '@/components/Feedback';
import { useStreamContext } from '@/context/Stream.context';
import Message from '@/pages/stream/components/Message';
import { DEVELOPMENT, API_URL } from '@/services/auth.services';
import { FetchMessages, ChannelQuery } from '@/pages/stream/types';

const activeClass = `bg-neutral-50 dark:bg-darkBG2
                    hover:text-neutral-700 dark:hover:text-orange-300
                    border-[1px] border-neutral-200 dark:border-neutral-800
                    dark:text-orange-200
                    text-orange-700`;

function MessagesNav({ user }: { user: string }): JSX.Element {
	const { pathname } = useLocation();
	const connected = useConnected(user);

	if (connected) {
		return (
			<NavLink
				preventScrollReset
				key={user}
				to={`/messages/${user}/`}
				className={classNames(
					`/messages/${user}/` === pathname
						? activeClass
						: 'dark:hover:bg-darkBG text-neutral-900 hover:bg-white hover:text-neutral-900 dark:text-neutral-100 dark:hover:text-white',
					'group flex items-center rounded-md px-3 py-2 text-sm'
				)}
				aria-current={pathname === user ? 'page' : undefined}
			>
				{/* <item.icon className="-ml-1 mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" /> */}
				<div className="flex-1 space-y-1">
					<div className="flex items-center justify-between">
						<span className="truncate">{user}</span>
						{/* todo: Add unread count and last message time */}
						{/* <div>
							<span>{badge('3 unread', 'bg-darkBG')}</span>
							<span className="ml-2 text-xs text-neutral-400 dark:text-neutral-600">
								1h ago
							</span>
						</div> */}
					</div>
				</div>
			</NavLink>
		);
	}
	return <div />;
}

export function Messages() {
	useDocumentTitle('Messages');
	const { usernames: circle } = useCircle() as {
		usernames: string[];
	};
	return (
		<div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
			<aside className="py-0 px-0 sm:py-6 sm:px-6 lg:col-span-4 lg:py-0 lg:px-0">
				<nav
					className="scrollbar dark:bg-darkBG2 hidden space-y-2 overflow-auto rounded-md border-[1px]
        p-4 dark:border-neutral-800 md:block lg:max-h-[77vh]"
				>
					{circle.map((user) => (
						<MessagesNav key={user} user={user} />
					))}
				</nav>
			</aside>
			<Outlet />
		</div>
	);
}

export function MessageChild(): JSX.Element {
	const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
	const { loggedInUser, streamToken } = useAuth();
	// UID of the other user
	const { username } = useParams() as { username: string };
	const otherUserUID = useStreamUID(username);
	// UID of logged in user
	const loggedInUserUserName = loggedInUser.username as string;
	const currUserUID = useStreamUID(loggedInUserUserName);
	// form state
	const [message, setMessage] = React.useState('');
	// reloadFetch is handled in the useeffect hook
	const [reloadFetch, setReloadFetch] = React.useState(false);
	const [noOfMessages, setNoOfMessages] = React.useState(7); // 6 is what fits in h-[60vh] and leaves room for infinite scroll
	const { connected, toggleConnection } = useStreamContext();
	const [showScrollDown, setShowScrollDown] = React.useState(false);
	const profileData = useProfile(loggedInUserUserName as string) as Profile;

	const channelRef = React.useRef() as React.MutableRefObject<Channel<DefaultGenerics>>;

	const qc = useQueryClient();
	const state = qc.getQueryState(['profile', loggedInUserUserName as string]);

	const fetchMessages = React.useCallback(
		({ channelVal, lastMessageID, ltOrGt }: FetchMessages) => {
			switch (channelVal !== null) {
				case true: {
					if (lastMessageID) {
						if (ltOrGt === 'id_lte') {
							return channelVal.query({
								messages: { limit: 50, id_lte: lastMessageID },
							});
						}
						return channelVal.query({
							messages: { limit: 50, id_gte: lastMessageID },
						});
					}
					return channelVal.query({ messages: { limit: 50 } });
				}
				default:
					return null;
			}
		},
		[]
	);

	const channelQuery = ({ channelVal, lastMessageID, ltOrGt, channelCID }: ChannelQuery) => ({
		queryKey: ['channel', channelCID],
		queryFn: () => fetchMessages({ channelVal, lastMessageID, ltOrGt }),
	});

	const {
		data: channelQData,
		isFetching: channelQFetching,
		isLoading: channelQLoading,
	} = useQuery({
		...channelQuery({
			channelVal: channelRef.current,
			channelCID: channelRef.current?.cid as string,
		}),
		enabled: Boolean(channelRef.current),
	});

	const handleSendMessage = async (text: string) => {
		if (channelRef.current && message.length > 0) {
			await channelRef.current.sendMessage({
				text,
			});
			qc.invalidateQueries(['channel', channelRef.current.cid]);
		}
	};

	const handleInfiniteScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		if (e.currentTarget.scrollTop === 0 && !channelQFetching) {
			const lengthOfMessages = channelQData?.messages.length;
			// here, we fetched 50 messages at first
			// so we can fetch from the existing cache if max messages fetched are <50
			if (lengthOfMessages && lengthOfMessages < 50) {
				setNoOfMessages(noOfMessages + 5);
			} else {
				// here, we are fetching more messages from the server
				setNoOfMessages(noOfMessages + 5);
				if (noOfMessages > 50) {
					fetchMessages({
						channelVal: channelRef.current,
						lastMessageID: channelQData?.messages[0].id,
						ltOrGt: 'id_lte',
					})
						?.then((res) => {
							setShowScrollDown(true);
							qc.setQueryData(['channel', channelRef.current?.cid as string], res);
						})
						.then(() => {
							setNoOfMessages(6);
						});
				}
			}
		}
	};

	React.useEffect(() => {
		if (
			streamToken !== null &&
			loggedInUser !== null &&
			currUserUID !== null &&
			otherUserUID !== null &&
			profileData !== null
		) {
			const CreateChannel = async () => {
				try {
					channelRef.current = client.channel('messaging', {
						members: [currUserUID, otherUserUID],
					});
				} catch (err) {
					toggleConnection(true);
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
						.catch(() => {
							toggleConnection(false);
							toast.custom(
								<Error error="Cannot connect to Stream. Try refreshing the page." />,
								{
									id: 'stream-connect-error',
								}
							);
						})
						.then(() => {
							channelRef.current = client.channel('messaging', {
								members: [currUserUID, otherUserUID],
							});
						});
				}
				if (channelRef.current !== undefined) {
					await channelRef.current
						.create()
						.then(async () => {
							await fetchMessages({ channelVal: channelRef.current })
								?.then((res) =>
									qc.setQueryData(
										['channel', channelRef.current?.cid as string],
										res
									)
								)
								.then(() => {
									setReloadFetch(true);
								});
						})
						.catch(() => {
							toast.custom(<Error error="Error initiating chat." />, {
								id: 'error-channel-create',
							});
						});
				}
			};
			CreateChannel();
		}
	}, [
		client,
		connected,
		currUserUID,
		fetchMessages,
		loggedInUser,
		otherUserUID,
		profileData,
		qc,
		streamToken,
		toggleConnection,
	]);
	const mutation = useMutation(
		async (text: string) => {
			await handleSendMessage(text);
		},
		{
			onMutate: async (text: string) => {
				await qc.cancelQueries(['channel', channelRef.current?.cid as string]);
				const previousMessages = qc.getQueryData([
					'channel',
					channelRef.current?.cid as string,
				]);
				// todo: remove any; fix this mess
				qc.setQueryData(
					['channel', channelRef.current?.cid as string],
					(old: { messages: any } | undefined) => ({
						...old,
						// eslint-disable-next-line no-unsafe-optional-chaining
						messages: [...old?.messages, { text }],
					})
				);
				return { previousMessages };
			},
			onSettled: () => {
				qc.invalidateQueries(['channel', channelRef.current?.cid as string]);
				setMessage('');
			},
			onSuccess: () => {
				setMessage('');
			},
			onError: (e: Error) => {
				if (e instanceof Error && e.message !== 'Error: Timeout exceeded 3000ms') {
					toast.custom(<Error error="Error sending message." />, {
						id: 'error-message-send',
					});
				}
				mutation.reset();
			},
		}
	);

	if (
		state?.status === 'loading' ||
		state?.status !== 'success' ||
		profileData === null ||
		channelQLoading
	) {
		return <MessagesLoading />;
	}
	if (channelQData || reloadFetch) {
		return (
			<div className="container mx-auto space-y-6 sm:px-6 lg:col-span-8 lg:px-0">
				<div className="shadow sm:rounded-md">
					<div
						className="bg-darkBG2 scrollbar flex h-[60vh] flex-col space-y-4 overflow-y-scroll
						rounded-md border-[1px] p-4 py-6 px-4 dark:border-neutral-800 sm:p-6"
						onScroll={(e) => handleInfiniteScroll(e)}
					>
						<div className="flex flex-col justify-end space-y-6">
							{showScrollDown && (
								<div className="flex justify-center">
									<button
										type="button"
										onClick={() => {
											setNoOfMessages(6);
											fetchMessages({
												channelVal: channelRef.current,
											})?.then((res) => {
												qc.setQueryData(
													['channel', channelRef.current?.cid as string],
													res
												);
											});
										}}
									>
										<ChevronDoubleDownIcon className="h-6 w-6 text-white" />
									</button>
								</div>
							)}

							{channelQData?.messages.slice(-noOfMessages).map((msg) => (
								<Message
									key={msg.id ? msg.id : 'loading'}
									username={
										msg.user
											? (msg.user.username as string)
											: loggedInUserUserName
									}
									self={msg.user ? msg.user.id === currUserUID : true}
									avatarURL={
										// todo: refactor this
										// eslint-disable-next-line no-nested-ternary
										msg.user
											? DEVELOPMENT
												? API_URL + msg.user.image
												: msg.user?.image
											: ''
									}
									message={msg.text as string}
								/>
							))}
						</div>
					</div>
				</div>
				<div className="flex items-start sm:space-x-4">
					<div className="flex-shrink-0">
						<img
							className="bg-linen hidden h-10 w-10 rounded-full object-cover sm:inline-block"
							src={DEVELOPMENT ? API_URL + profileData.avatar : profileData.avatar}
							alt=""
						/>
					</div>
					<div className="min-w-0 flex-1">
						<div className="relative">
							<form
								onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
									e.preventDefault();
									e.target.reset();
									if (message.length > 0 && message !== '\n') {
										handleSendMessage(message).then(() => {
											setMessage('');
										});
									}
								}}
							>
								<div className="bg-darkBG2 overflow-hidden rounded-lg border-[1px] border-neutral-800 shadow-sm placeholder:text-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm">
									<label htmlFor="message">
										<textarea
											rows={2}
											name="message"
											id="message"
											className="bg-darkBG block w-full resize-none p-2 py-3 placeholder:text-gray-500 focus:outline-none sm:text-sm"
											placeholder={`Message ${username}`}
											defaultValue={message}
											onChange={(e) => setMessage(e.target.value)}
											onKeyDown={(
												e: React.KeyboardEvent<HTMLTextAreaElement>
											) => {
												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault();
													if (message.length > 0 && message !== '\n') {
														setNoOfMessages(6); // to keep the scroll at the bottom
														mutation.mutate(message);
														const target =
															e.target as HTMLTextAreaElement;
														target.value = '';
													}
												}
											}}
										/>
									</label>
									<div className="py-1" aria-hidden="true">
										<div className="py-px">
											<div className="h-9" />
										</div>
									</div>
								</div>

								<div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
									<div className="flex items-center space-x-5">
										<div className="flex items-center">
											<button
												type="submit"
												className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
											>
												<PaperClipIcon
													className="h-5 w-5"
													aria-hidden="true"
												/>
												<span className="sr-only">Attach a file</span>
											</button>
										</div>
									</div>
									<div className="flex-shrink-0">
										<button
											type="submit"
											className="bg-darkBG2 hover:bg-darkBG inline-flex items-center rounded-md border-[1px] border-neutral-800
											px-6 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-600"
										>
											Send
											<PaperAirplaneIcon
												className="ml-2 h-5 w-5"
												aria-hidden="true"
											/>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <MessagesLoading />;
}
