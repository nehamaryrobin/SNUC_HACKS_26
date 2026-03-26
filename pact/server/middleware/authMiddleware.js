const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      );

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  // --- HACKATHON BYPASS: Auto-Login if no token ---
  if (!token) {
    try {
      let demoUser = await User.findOne({ email: 'demo@pact.com' });
      if (!demoUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        demoUser = await User.create({
          name: 'Demo User',
          email: 'demo@pact.com',
          password: hashedPassword,
        });
      }
      req.user = demoUser;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, no token and auto-login failed' });
    }
  }
};

module.exports = { protect };
