import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import LeaderboardGeneralService from '../services/LeaderboardGeneralService';

export default class LeaderboardController {
  constructor(
    private matchService = new LeaderboardService(),
    private matchLeaderboard = new LeaderboardGeneralService(),
  ) {}

  async getScoreHome(_req: Request, res: Response): Promise<void> {
    const result = await this.matchService.getLeaderBoard('home');

    res.status(200).json(result);
  }

  async getScoreAway(_req: Request, res: Response): Promise<void> {
    const result = await this.matchService.getLeaderBoard('away');

    res.status(200).json(result);
  }

  async getScoreGeneral(_req: Request, res: Response): Promise<void> {
    const result = await this.matchLeaderboard.getLeaderBoardGeneral();

    res.status(200).json(result);
  }
}
