import { Response, Request, NextFunction } from 'express';
import User from '../entities/User';

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;

    if (!user) throw new Error('Unauthenticated');
    // const token = req.cookies.token;
    // if (!token) throw new Error('Unauthenticated');

    // const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);

    // const user = await User.findOne({ username });

    // if (!user) throw new Error('Unauthenticated');

    // res.locals.user = user;
    return next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: 'Unauthenticated' });
  }
};
