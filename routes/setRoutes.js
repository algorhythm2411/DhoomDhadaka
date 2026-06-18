const express = require('express');
const { getDILRSet } = require('../controllers/setController');
const router = express.Router();

// Route: URL me Google Drive ki fileId pass karke data fetch karne ke liye
router.get('/:fileId', getDILRSet);

module.exports = router;
