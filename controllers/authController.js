const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Register Karte Waqt Ka Logic
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check karo agar user already exists hai
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already taken' });
    }

    // Password ko secure (hash) karo
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Naya user create karo
    const newUser = new User({
      username,
      email,
      passwordHash
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. User Login Karte Waqt Ka Logic
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check karo user database me hai ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Password match karo
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // JWT Token generate karo session ke liye
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // 7 din tak login rahega
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        eloRating: user.eloRating,
        rankTier: user.rankTier,
        currentStreak: user.currentStreak
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
