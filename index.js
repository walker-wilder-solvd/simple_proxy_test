const cors = require('cors');
const express = require('express');
const proxyLib = require('express-http-proxy');
const url = require('url');
const app = express();
const port = 8081;

const handler = async (request, response) => {
	const destination = `http://127.0.0.1:8080${request.path}`
	console.log(destination);
	const proxy = await proxyLib(destination, {
		proxyReqPathResolver: (request) => {
			const finalUrl = (url.parse(destination).href ?? '') + (url.parse(request.originalUrl).search ?? '')
			console.log(finalUrl);
			return finalUrl;
		}
	});
	proxy(request, response, (a) => {
		console.log(a);
		response.sendStatus(404)
	});
}

app.use(cors())

app.options('*', (request, response, next) => {
	if (request?.path.includes('cors')) {
		const origin = request.headers.origin ?? 'null';
		response.setHeader('Access-Control-Allow-Origin', origin === 'null' ? '*' : origin);
		response.setHeader('Access-Control-Allow-Headers', request.headers['access-control-allow-headers'] ?? 'authorization,content-type');
		response.sendStatus(204);
		return;
	}

	next();
})

app.get('/*', handler);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});