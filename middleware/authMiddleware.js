const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check karo agar header me Authorization header hai aur wo Bearer se start hota hai
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token extract karo
      token = req.headers.authorization.split(' ')[1];

      // Token verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ka data request object me attach karo (password chod kar)
      req.user = await User.findById(decoded.id).select('-passwordHash');

      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token found' });
  }
};

module.exports = { protect };
