import { renderPage } from 'vite-plugin-ssr';

export default async function handler(req, res) {
	const { url } = req;
	console.log('Request to url:', url);

	const pageContextInit = { url };
	const pageContext = await renderPage(pageContextInit);
	const { httpResponse } = pageContext;

	if (!httpResponse) {
		res.statusCode = 200;
		res.end();
		return;
	}

	const { body, statusCode, contentType } = httpResponse;
	res.statusCode = statusCode;
	res.setHeader('content-type', contentType);
	res.end(body);
}
