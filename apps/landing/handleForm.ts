/* eslint-disable turbo/no-undeclared-env-vars */
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function handleForm(email: string) {
	const data = {
		email,
	};

	axios.post('/api/handleForm', data).then((response) => {
		if (response.status === 200) {
			toast.success(`Thanks, you'll be notified of the launch!`, {
				style: {
					background: '#000',
					color: '#fff',
					border: '1px dashed #555',
					width: '100%',
					fontSize: '18px',
					textAlign: 'center',
				},
				duration: 5000,
				icon: '🚀',
			});

			return response.data;
		}
		toast.error(`Something went wrong, please try again.`, {
			style: {
				background: '#000',
				color: '#fff',
				border: '1px dashed #555',
				width: '100%',
				fontSize: '18px',
				textAlign: 'center',
			},
			duration: 5000,
			icon: '🚨',
		});
		return response.data;
	});
}
