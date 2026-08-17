const crypto = require('crypto');

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const HASH_ALGORITHM = 'scrypt';

function scryptAsync(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = await scryptAsync(password, salt);
  return `${HASH_ALGORITHM}:${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') {
    return false;
  }

  const [algorithm, salt, expectedHash] = storedHash.split(':');

  if (algorithm !== HASH_ALGORITHM || !salt || !expectedHash) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (expectedBuffer.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, derivedKey);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
