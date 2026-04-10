// middleware/auth.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check if an authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed: No token provided.' });
  }

  // Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user information to the request object
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

module.exports = authMiddleware;