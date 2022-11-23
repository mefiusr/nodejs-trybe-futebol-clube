import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { JwtPayload, verify } from 'jsonwebtoken';
import HttpException from '../utils/http.exception';

dotenv.config();

export default function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const { authorization: token } = req.headers;

  if (!token) {
    throw new HttpException(401, 'Token not found');
  }

  try {
    const decoded = verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;

    req.body.user = decoded;
    next();
  } catch (err) {
    throw new HttpException(401, 'Invalid token');
  }
}
