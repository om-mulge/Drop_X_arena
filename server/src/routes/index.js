const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    ok: true,
    message: 'Battle Arena Drop API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
