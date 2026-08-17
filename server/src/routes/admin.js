const express = require('express');

const { createJwt } = require('../lib/jwt');
const { requireAdminAuth } = require('../middleware/admin-auth');
const { authenticateAdmin, findAdminById } = require('../services/admin-service');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email and password are required',
      });
    }

    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid admin credentials',
      });
    }

    const token = createJwt({
      sub: admin.id,
      email: admin.email,
      role: 'admin',
    });

    return res.json({
      ok: true,
      token,
      admin,
    });
  } catch (error) {
    console.error('Admin login failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to complete admin login',
    });
  }
});

router.get('/me', requireAdminAuth, async (req, res) => {
  try {
    const admin = await findAdminById(req.admin.sub);

    if (!admin || !admin.is_active) {
      return res.status(401).json({
        ok: false,
        message: 'Admin account is no longer active',
      });
    }

    return res.json({
      ok: true,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        isActive: admin.is_active,
        createdAt: admin.created_at,
        updatedAt: admin.updated_at,
      },
    });
  } catch (error) {
    console.error('Admin session lookup failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to load admin session',
    });
  }
});

module.exports = router;
