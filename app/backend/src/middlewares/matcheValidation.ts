import { NextFunction, Request, Response } from 'express';

export default function matcheValidation(req: Request, res: Response, next: NextFunction) {
  const { homeTeam, awayTeam } = req.body;
  console.log(homeTeam, awayTeam);

  if (homeTeam === awayTeam) {
    res.status(422).json({ message: 'It is not possible to create a match with two equal teams' });
  }
  next();
}
