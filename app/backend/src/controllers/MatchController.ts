import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatcheController {
  constructor(private matchService = new MatchService()) {}

  async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    const isQuery = inProgress === undefined
      ? await this.matchService.getAllMatches()
      : await this.matchService.getMatchesInProgress(inProgress as string);
    return res.status(200).json(isQuery);
  }
}
