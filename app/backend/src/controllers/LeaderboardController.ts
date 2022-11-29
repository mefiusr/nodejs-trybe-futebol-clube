import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private matchService = new LeaderboardService()) {}

  async getScoreHome(_req: Request, res: Response): Promise<void> {
    const result = await this.matchService.getLeaderHome();

    res.status(200).json(result);
  }
}
