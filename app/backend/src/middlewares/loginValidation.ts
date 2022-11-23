import { NextFunction, Request, Response } from 'express';

export default function loginValidation(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const validEmail = /\S+@\S+\.\S+/;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  if (!validEmail.test(email)) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  next();
}
