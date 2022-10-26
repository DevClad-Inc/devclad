import React from 'react';

export default function useDocumentTitle(title: string) {
	React.useEffect(() => {
		document.title = `DevClad - ${title}`;
	}, [title]);
}
