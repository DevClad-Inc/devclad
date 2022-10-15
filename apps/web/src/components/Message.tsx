import React from 'react';
import { classNames } from '@devclad/lib';
import { Link } from 'react-router-dom';

export interface MessageProps {
	self: boolean;
	username: string;
	avatarURL: string;
	message: string;
}

export default function Message({ self, username, avatarURL, message }: MessageProps) {
	return (
		<div className={classNames(self ? 'flex-row-reverse' : '', 'flex items-center space-x-2')}>
			{self === false && (
				<div className="flex-shrink-0">
					<img className="h-10 w-10 rounded-full" src={avatarURL} alt="" />
				</div>
			)}
			<div className={classNames(self ? 'flex-row' : 'flex-row-reverse')}>
				<div className="flex items-center space-x-2">
					<div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
						<span className="text-orange-400">@</span>
						<span className="text-orange-400">
							<Link to={`/profile/${username}`}>{username}</Link>
						</span>
					</div>
					<div className="text-xs text-neutral-400 dark:text-neutral-600">
						<span>1h ago</span>
					</div>
				</div>
				<div className="mt-2 max-w-sm rounded-xl bg-neutral-900 p-3 text-sm text-neutral-100">
					<span>{message}</span>
				</div>
			</div>
		</div>
	);
}
