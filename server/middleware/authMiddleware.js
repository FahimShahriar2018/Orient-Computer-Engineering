import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes and verify JWT Bearer token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'orient_jwt_secret_key_2026'
      );

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        return next(new Error('User not found. Authorization failed.'));
      }

      req.user = user;
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Invalid or expired token. Not authorized.'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('No token provided. Not authorized.'));
  }
};

// Middleware for optional authentication (populates req.user if token is present, but allows guests)
export const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'orient_jwt_secret_key_2026'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token verification errors for optional routes, req.user remains undefined
      req.user = null;
    }
  }

  return next();
};

// Middleware to verify Administrator privileges
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  return next(new Error('Access denied. Administrator privileges required.'));
};

