const User = require('../models/User');
const drive = require('../config/drive');

// 1. User ke answers check karna aur Gamification Metrics update karna
const submitSetAnswers = async (req, res) => {
  try {
    const { fileId, userAnswers } = req.body; // userAnswers: { q1: "A", q2: "C", ... }
    const userId = req.user._id;

    // Google Drive se us set ka original JSON data (with correct answers) fetch karo
    const driveResponse = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
    
    const setData = driveResponse.data;
    const correctAnswers = setData.correctAnswers; // Expected format in JSON: { q1: "A", q2: "B"... }

    let totalQuestions = Object.keys(correctAnswers).length;
    let correctCount = 0;

    // Score calculate karo
    for (let key in correctAnswers) {
      if (userAnswers[key] === correctAnswers[key]) {
        correctCount++;
      }
    }

    // --- GAME LOGIC: ELO RATING CALCULATION ---
    // CAT me +3 for correct, -1 for wrong (MCQ). TITA me no negative marking.
    // Hum simple Elo scaling lagate hain: Correct pe +15 Elo, Wrong pe -5 Elo
    const wrongCount = totalQuestions - correctCount;
    let eloChange = (correctCount * 15) - (wrongCount * 5);
    
    // User profile fetch karo database se
    const user = await User.findById(userId);

    // New Elo update karo (Elo kabhi 0 se kam nahi hona chahiye)
    user.eloRating = Math.max(100, user.eloRating + eloChange);

    // Rank Tier update logic based on Elo
    if (user.eloRating < 1400) user.rankTier = 'Bronze';
    else if (user.eloRating < 1800) user.rankTier = 'Silver';
    else if (user.eloRating < 2200) user.rankTier = 'Gold';
    else if (user.eloRating < 2600) user.rankTier = 'Diamond';
    else user.rankTier = 'Grandmaster';

    // --- STREAK LOGIC ---
    const today = new Date().setHours(0, 0, 0, 0);
    if (user.lastPlayedDate) {
      const lastPlayed = new Date(user.lastPlayedDate).setHours(0, 0, 0, 0);
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (today - lastPlayed === oneDayInMs) {
        // Agar kal khela tha toh streak badhao
        user.currentStreak += 1;
      } else if (today - lastPlayed > oneDayInMs) {
        // Agar beech me gap ho gaya toh streak reset to 1
        user.currentStreak = 1;
      }
      // Agar aaj hi dobara khel rha h toh streak same rahegi
    } else {
      // Pehli baar khel rha h
      user.currentStreak = 1;
    }

    if (user.currentStreak > user.highestStreak) {
      user.highestStreak = user.currentStreak;
    }
    user.lastPlayedDate = new Date();

    // Stats updates
    user.totalSetsAttempted += 1;
    if (correctCount === totalQuestions) {
      user.totalSetsSolvedCorrectly += 1;
    }

    await user.save();

    res.json({
      success: true,
      message: "Set Evaluation Complete!",
      results: {
        totalQuestions,
        correctCount,
        wrongCount,
        eloChange,
        newElo: user.eloRating,
        currentStreak: user.currentStreak,
        rankTier: user.rankTier
      }
    });

  } catch (error) {
    console.error('❌ Set submission error:', error.message);
    res.status(500).json({ message: 'Server error during submission', error: error.message });
  }
};

// 2. Global Leaderboard fetch karne ka endpoint
const getLeaderboard = async (req, res) => {
  try {
    // Top 20 users ko Elo Rating ke hisab se sort karke nikalenge
    const leaderboard = await User.find()
      .sort({ eloRating: -1 })
      .limit(20)
      .select('username eloRating rankTier currentStreak'); // Sirf zaroori fields bhejenge

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
};

module.exports = { submitSetAnswers, getLeaderboard };
