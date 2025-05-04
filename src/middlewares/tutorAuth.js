const jwt = require('jsonwebtoken');
const Tutor = require('../models/tutors');
const logger = require('../utils/logger');

/**
 * Authentication middleware for tutors
 * Verifies JWT token and attaches tutor to request
 */
exports.authenticateTutor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    
    const tutor = await Tutor.findById(decoded.sub);
    
    if (!tutor) {
      return res.status(401).json({ error: 'Tutor not found' });
    }
    
    if (!tutor.verified) {
      return res.status(403).json({ error: 'Account not verified' });
    }
    
    req.tutor = tutor;
    
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Role-based access control middleware for tutors
 */
exports.tutorRoleCheck = (req, res, next) => {
  if (!req.tutor) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.tutor.role !== 'tutor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Insufficient permissions'
    });
  }
  
  next();
};