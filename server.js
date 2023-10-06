const fs = require('fs');
const https = require('https');
const path = require('path');
const http2 = require('http2');
const { pipeline } = require('stream');

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
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
    res.writeHead(200, { 'content-type': 'text/plain', ...corsHeaders });
    const filePath = path.join(__dirname, 'public', req.url.substring(req.url.length - 1, req.url.length));
    pipeline(fs.createReadStream(filePath), res, (err) => {
      err ? console.error(err) : console.log('fetched', filePath);
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

const certsPath = path.join(__dirname, 'certs');
const options = {
  key: fs.readFileSync(path.join(certsPath, 'key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join(certsPath, 'cert.pem'), 'utf8'),
};

const http1Server = https.createServer(options, app);
const http2Server = http2.createSecureServer(options, app);

http1Server.listen(18443, () => {
  console.log('HTTPS server listening on port 18443');
});

http2Server.listen(28443, () => {
  console.log('HTTP/2 server listening on port 28443');
});
