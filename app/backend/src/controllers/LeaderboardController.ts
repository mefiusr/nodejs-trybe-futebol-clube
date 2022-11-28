import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private matchService = new LeaderboardService()) {}

  async getMatches(_req: Request, res: Response) {
    const result = await this.matchService.getMatchesFinisheds();
    res.status(200).json(result);
  }
}
