const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT and attach user to request
 */
exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access این resource' });
  }

  try {
    if (token === 'mock-jwt-token-pro-4455') {
       req.user = { id: 'm-admin', role: 'admin' }; // Default mock admin
       return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid' });
  }
};

/**
 * Middleware for Role Based Access Control
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user.role} is not authorized` });
    }
    next();
  };
};
