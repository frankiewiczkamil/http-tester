import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const certsPath = join(__dirname, 'certs');
export const SSL_OPTIONS = {
  key: readFileSync(join(certsPath, 'key.pem'), 'utf8'),
  cert: readFileSync(join(certsPath, 'cert.pem'), 'utf8'),
};
