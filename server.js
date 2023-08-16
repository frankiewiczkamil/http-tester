const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const https = require('https');
const spdy = require('spdy');
const path = require('path');

app.use(cors());
app.use(express.static('public'));

app.get('/simulate', async (req, res) => {
  const { port } = req.query;
  console.log(`Simulating on port ${port}`);
  const filePath = 'public/index.html';

  const fileStream = fs.createReadStream(filePath);

  fileStream.on('open', () => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=file.txt');

    fileStream.pipe(res);
  });
});

const certsPath = path.join(__dirname, 'certs');
const options = {
  key: fs.readFileSync(path.join(certsPath, 'key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join(certsPath, 'cert.pem'), 'utf8'),
};

const httpsServer = https.createServer(options, app);
const http2Server = spdy.createServer(options, app);

httpsServer.listen(18443, () => {
  console.log('HTTPS server listening on port 18443');
});

http2Server.listen(28443, () => {
  console.log('HTTP/2 server listening on port 28443');
});
