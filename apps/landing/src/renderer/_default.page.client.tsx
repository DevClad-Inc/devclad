/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import PageShell from './PageShell';
import type { PageContextClient, PageContextCustom } from './types';

async function render(pageContext: PageContextClient) {
	const { Page, pageProps } = pageContext as PageContextCustom;
	hydrateRoot(
		document.getElementById('page-view')!,
		<PageShell pageContext={pageContext}>
			<Page {...pageProps} />
		</PageShell>
	);
}

// eslint-disable-next-line import/prefer-default-export
export { render };
