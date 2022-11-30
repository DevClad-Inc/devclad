import React from 'react';
import { toast } from 'react-hot-toast';
import { Error } from '@/components/Feedback';

export const throwToastError = (error: string) => {
	toast.custom(<Error error={error} />, {
		id: `${crypto.randomUUID()}-sp-update-error`,
	});
};

export const daysOfWeek = [
	{ name: 'Sunday', id: 0 },
	{ name: 'Monday', id: 1 },
	{ name: 'Tuesday', id: 2 },
	{ name: 'Wednesday', id: 3 },
	{ name: 'Thursday', id: 4 },
	{ name: 'Friday', id: 5 },
	{ name: 'Saturday', id: 6 },
	{ name: 'Any Day', id: 7 },
];

export const hoursOfDay = [
	{ name: '6AM - 12PM', id: 0 },
	{ name: '12PM - 4PM', id: 1 },
	{ name: '4PM - 8PM', id: 2 },
	{ name: '8PM - 12AM', id: 3 },
	{ name: '12AM - 6AM', id: 4 },
	{ name: 'Anytime', id: 5 },
];
