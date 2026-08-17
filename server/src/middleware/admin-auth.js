const { verifyJwt } = require('../lib/jwt');

function getBearerToken(headerValue) {
  if (!headerValue || typeof headerValue !== 'string') {
    return null;
  }

  const [scheme, token] = headerValue.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function requireAdminAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ ok: false, message: 'Missing admin token' });
    }

    req.admin = verifyJwt(token);
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: error.message || 'Invalid admin token' });
  }
}

module.exports = {
  requireAdminAuth,
};
