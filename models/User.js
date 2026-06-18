const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Basic Info
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },

  // Gamification & Progression
  eloRating: { 
    type: Number, 
    default: 1200 // Standard starting Elo for competitive games
  },
  rankTier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Diamond', 'Grandmaster'],
    default: 'Bronze'
  },

  // Streak Mechanics
  currentStreak: { 
    type: Number, 
    default: 0 
  },
  highestStreak: { 
    type: Number, 
    default: 0 
  },
  lastPlayedDate: { 
    type: Date,
    default: null
  },

  // Stats
  totalSetsAttempted: { 
    type: Number, 
    default: 0 
  },
  totalSetsSolvedCorrectly: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
