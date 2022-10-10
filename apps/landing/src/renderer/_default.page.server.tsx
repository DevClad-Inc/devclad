/* eslint-disable react/jsx-props-no-spreading */
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr';
import PageShell from './PageShell';
import { PageContextCustom, PageContextServer } from './types';

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname'];

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext as PageContextCustom;
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports;
  const title =
    (documentProps && documentProps.title) || 'DevClad - Network, Build, and Ship rapidly';
  const desc =
    (documentProps && documentProps.description) ||
    'Social Workspace Platform built for developers. Meet developers 1:1 using AI, build your network, and ship the next best thing.';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en" class="h-full">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <meta name="theme-color" content="#101218" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://devclad.com/" />
        <meta name="title" content="DevClad - Social Workspace Platform for Developers" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devclad.com/" />
        <meta property="og:title" content="${title}" />
        <meta
          property="og:description"
          content="${desc}"
        />
        <meta
          property="og:image"
          content="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/677a1e0a-bd95-4e85-7aa3-86287a865f00/public"
        />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://devclad.com/" />
        <meta property="twitter:title" content="${title}" />
        <meta
          property="twitter:description"
          content="${desc}"
        />
        <meta
          property="twitter:image"
          content="https://imagedelivery.net/nF-ES6OEyyKZDJvRdLK8oA/677a1e0a-bd95-4e85-7aa3-86287a865f00/public"
        />
        <title>DevClad | Social Workspace Platform for Developers ⚡️</title>
      </head>
      <body id="body" class="scrollbar overflow-x-hidden overflow-y-scroll bg-black">
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
