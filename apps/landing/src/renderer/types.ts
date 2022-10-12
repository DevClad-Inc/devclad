import type { PageContextBuiltIn } from 'vite-plugin-ssr';
// import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router' // When using Client Routing
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client';

type Page = (pageProps: PageProps) => React.ReactElement;
type PageProps = { basePath?: string; Page?: Page; pageContext?: PageContext };

export type PageContextCustom = {
	Page: Page;
	pageProps?: PageProps;
	urlPathname: string;
	exports: {
		documentProps?: {
			title?: string;
			description?: string;
		};
	};
};

type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom;
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom;

type PageContext = PageContextClient | PageContextServer;

export type { PageContextServer };
export type { PageContextClient };
export type { PageContext };
export type { PageProps }; // When using Server Routing
