const convertTimeZone = (ISOTime: string, timeZone: string): string => {
	const date = new Date(ISOTime);
	const localTime = date.toLocaleString('en-US', { timeZone });
	return localTime;
};

export default convertTimeZone;
