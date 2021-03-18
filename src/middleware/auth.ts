import { Response, Request, NextFunction } from 'express';
import User from '../entities/User';

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;

    if (!user) throw new Error('Unauthenticated');

    return next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: 'Unauthenticated' });
  }
};
