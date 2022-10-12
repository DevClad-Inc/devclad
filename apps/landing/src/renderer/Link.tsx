import React from 'react';
import { usePageContext } from './usePageContext';

export default function Link({
	className,
	to,
	children,
}: {
	className: string;
	to: string;
	children: React.ReactNode;
}) {
	const { pageProps } = usePageContext();
	const href = to.startsWith('/') ? to : `${pageProps?.basePath}${to}`;
	const genClassName = className ? ` ${className}` : '';
	return (
		<a href={href} className={`navitem${genClassName}`}>
			{children}
		</a>
	);
}
