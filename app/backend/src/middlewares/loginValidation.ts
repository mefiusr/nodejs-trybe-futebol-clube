import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/http.exception';

export default function loginValidation(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const validEmail = /\S+@\S+\.\S+/;

  if (!email || !password) {
    throw new HttpException(400, 'All fields must be filled');
  }

  if (!validEmail.test(email)) {
    throw new HttpException(401, 'Incorrect email or password');
  }

  next();
}
