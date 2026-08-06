import express from 'express';
import type { Request, Response, NextFunction } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { User } from './models.js';
import env from './config/env.js';

const JWT_SECRET = env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.auth_token;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as any;
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.isBlocked) {
      res.status(403).json({ error: "Forbidden or account blocked" });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
};
