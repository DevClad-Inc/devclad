import { Channel, DefaultGenerics } from 'stream-chat';

export type LtOrGtType = 'id_lte' | 'id_gte' | undefined;

export interface FetchMessages {
	channelVal: Channel<DefaultGenerics>;
	lastMessageID?: string;
	ltOrGt?: LtOrGtType;
}

export interface ChannelQuery extends FetchMessages {
	channelCID: string; // this is channel ID, check stream docs
}

export interface MeetingCreateUpdate {
	name: string;
	invites: string[];
	type_of: string;
	time: string;
	organizer: string | number; // username when fetching all meetings, id when fetching individual meeting
}

export interface Meeting extends MeetingCreateUpdate {
	id: number;
	uid: string;
	attended: boolean;
	invite_emails: string[];
}

export interface MeetingEmail {
	typeOf: string;
	time: string;
	uid: string;
	email: string;
	firstName: string;
	inviteName: string;
	timeZone: string;
}

export type EmailType = 'welcome' | 'reminder' | 'approved' | 'rejected';
