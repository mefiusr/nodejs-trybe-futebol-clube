import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/http.exception';

export default function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const { authorization: token } = req.headers;

  if (!token) {
    throw new HttpException(401, 'Token not found');
  }

  try {
    const decoded = jwt.verify(token as string, process.env.JWTSECRET as string) as jwt.JwtPayload;

    req.body.user = decoded;

    next();
  } catch (err) {
    throw new HttpException(401, 'Token must be a valid token');
  }
}
