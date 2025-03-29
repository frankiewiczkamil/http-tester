import { randomBytes } from 'crypto';
import { Readable } from 'stream';

export function createRandomStream(length) {
  let bytesSent = 0;

  return new Readable({
    read(chunkSize) {
      if (bytesSent >= length) {
        this.push(null); // End the stream
        return;
      }

      const bytesToSend = Math.min(chunkSize, length - bytesSent);
      this.push(randomBytes(bytesToSend)); // Generate random data
      bytesSent += bytesToSend;
    },
  });
}
