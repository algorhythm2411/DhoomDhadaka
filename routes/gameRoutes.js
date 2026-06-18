const express = require('express');
const { submitSetAnswers, getLeaderboard } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route: Answer submit karne ke liye (User must be logged in)
router.post('/submit', protect, submitSetAnswers);

// Route: Leaderboard dekhne ke liye (Public endpoint)
router.get('/leaderboard', getLeaderboard);

module.exports = router;
