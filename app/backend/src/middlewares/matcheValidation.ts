import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/http.exception';

export default function matcheValidation(req: Request, _res: Response, next: NextFunction) {
  const { homeTeam, awayTeam } = req.body;

  if (homeTeam === awayTeam) {
    throw new HttpException(422, 'It is not possible to create a match with two equal teams');
  }

  next();
}
