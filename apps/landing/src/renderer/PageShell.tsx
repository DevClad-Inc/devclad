import React from 'react';
import { inject } from '@vercel/analytics';
import { PageContextProvider } from './usePageContext';
import type { PageContext } from './types';
import '@devclad/ui/fontscss';
import '@/root.css';

function Content({ children }: { children: React.ReactNode }) {
	return <div className="bg-black text-white">{children}</div>;
}

export default function PageShell({
	children,
	pageContext,
}: {
	children: React.ReactNode;
	pageContext: PageContext;
}) {
	inject();
	return (
		<React.StrictMode>
			<PageContextProvider pageContext={pageContext}>
				<Content>{children}</Content>
			</PageContextProvider>
		</React.StrictMode>
	);
}
