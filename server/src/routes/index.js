const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');

router.get('/status', (req, res) => {
  res.json({
    ok: true,
    message: 'Battle Arena Drop API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/admin', adminRoutes);

module.exports = router;
