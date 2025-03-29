import https from 'https';
import http2 from 'http2';
import fs from 'fs';
import { dirname, join } from 'path';
import { pipeline } from 'stream';
import { fileURLToPath } from 'url';
import { createRandomStream } from './randomInputStream.js';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexHtmlPath = join(__dirname, 'public', 'index.html');

const app = (req, res) => {
  if (req.url === '/index.html') {
    fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url.substring(0, req.url.length - 1) === '/simulate/') {
    res.writeHead(200, { 'content-type': 'text/plain', ...corsHeaders, encoding: 'chunked' });
    pipeline(createRandomStream(8192), res, (err) => {
      err ? console.error(err) : console.log('generated stream');
    });
  } else if (req.url === '/simulate') {
    res.writeHead(200, corsHeaders);
    pipeline(fs.createReadStream(indexHtmlPath), res, (err) => {
      err ? console.error(err) : console.log('done');
    });
  } else {
    res.writeHead(200, { 'content-type': 'text/plain', ...corsHeaders });
    res.end('default');
  }
};

const certsPath = join(__dirname, 'certs');
const options = {
  key: fs.readFileSync(join(certsPath, 'key.pem'), 'utf8'),
  cert: fs.readFileSync(join(certsPath, 'cert.pem'), 'utf8'),
};

const http1Server = https.createServer(options, app);
const http2Server = http2.createSecureServer(options, app);

http1Server.listen(18443, () => {
  console.log('HTTPS server listening on port 18443');
});

http2Server.listen(28443, () => {
  console.log('HTTP/2 server listening on port 28443');
});
