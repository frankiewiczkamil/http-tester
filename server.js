import { createServer as http1SslServer } from 'https';
import { createSecureServer as http2SslServer } from 'http2';
import { pipeline } from 'stream';
import { createRandomStream } from './randomInputStream.js';
import { serveUi } from './serveUi.js';
import { SSL_OPTIONS } from './ssl.js';
import { CORS_HEADERS } from './cors.js';

function app(req, res) {
  if (req.url.startsWith('/simulate')) {
    res.writeHead(200, CORS_HEADERS);
    pipeline(createRandomStream(1024 * 1024), res, (err) => (err ? console.error(err) : console.log('generated stream')));
  } else {
    serveUi(req, res);
  }
}

http1SslServer(SSL_OPTIONS, app).listen(18443, () => console.log('HTTPS server listening on port 18443'));
http2SslServer(SSL_OPTIONS, app).listen(28443, () => console.log('HTTP/2 server listening on port 28443'));
