const crypto = require('crypto');

function encodeBase64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(`${normalized}${'='.repeat(padding)}`, 'base64').toString('utf8');
}

function createJwt(payload, options = {}) {
  const secret = options.secret || process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_JWT_SECRET;

  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is required to sign admin tokens');
  }

  const expiresInSeconds = options.expiresInSeconds || 60 * 60 * 12;
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const tokenPayload = {
    ...payload,
    iat: issuedAt,
    exp: issuedAt + expiresInSeconds,
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(tokenPayload));
  const content = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(content)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${content}.${signature}`;
}

function verifyJwt(token, options = {}) {
  const secret = options.secret || process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_JWT_SECRET;

  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is required to verify admin tokens');
  }

  if (!token || typeof token !== 'string') {
    throw new Error('Missing token');
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const content = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(content)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    throw new Error('Invalid token signature');
  }

  const header = JSON.parse(decodeBase64Url(encodedHeader));
  const payload = JSON.parse(decodeBase64Url(encodedPayload));

  if (header.alg !== 'HS256') {
    throw new Error('Unsupported token algorithm');
  }

  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error('Token expired');
  }

  return payload;
}

module.exports = {
  createJwt,
  verifyJwt,
};
