/* eslint-disable turbo/no-undeclared-env-vars */
import express, { Request } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import { ExpressPeerServer } from 'peer';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const allowlist = process.env.ALLOWED_ORIGINS?.split(',');

const corsOptions = (
	req: Request,
	callback: (err: Error | null, options?: cors.CorsOptions) => void
) => {
	if (
		allowlist?.indexOf(req.header('Origin') as string) !== -1 ||
		req.header('Origin') === undefined
	) {
		callback(null, { origin: true });
	} else {
		throw new Error('CORS not allowed');
	}
};

const app = express();
app.use(cors<Request>(corsOptions));

const server = app.listen(process.env.PORT || 9000, () => {}); // defined as 443 in the .env file

const peerServer = ExpressPeerServer(server, {
	path: '/',
});

app.use('/peerjs', peerServer);

app.get('/', (req, res) => res.send('Peer Server is running'));

peerServer.on('connection', (client) => {
	console.log('client connected', client);
});
