import React from 'react';
import { toast } from 'react-hot-toast';
import { Error } from '@/components/Feedback';

export const throwToastError = (error: string) => {
	toast.custom(<Error error={error} />, {
		id: `${crypto.randomUUID()}-sp-update-error`,
	});
};
