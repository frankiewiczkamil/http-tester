const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const https = require('https');
const spdy = require('spdy');
const path = require('path');

const wait = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
};

app.use(cors());
app.use(express.static('public'));

app.get('/simulate', async (req, res) => {
  const { port } = req.query;
  console.log(`Simulating on port ${port}`);
  await wait();
  res.send(`Simulation complete on port ${port}`);
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
