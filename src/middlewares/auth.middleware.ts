import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtUserPayload } from '../types/express';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: 'Authorization header is missing',
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Format must be "Bearer <token>"',
    });
    return;
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET || 'super-secure-random-jwt-secret-key-change-me';

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid or malformed token',
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};
