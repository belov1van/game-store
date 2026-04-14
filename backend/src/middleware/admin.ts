import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.userRole !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden: admin access required' });
    return;
  }
  next();
};
