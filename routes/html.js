// Import Express router
const router = require('express').Router();
const path = require('path');

// Establish index route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export HTML router
module.exports = router;