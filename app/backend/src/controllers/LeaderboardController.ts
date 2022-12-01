import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import LeaderboardGeneralService from '../services/LeaderboardGeneralService';

export default class LeaderboardController {
  constructor(
    private matchService = new LeaderboardService(),
    private matchLeaderboard = new LeaderboardGeneralService(),
  ) {}

  async getScoreHome(_req: Request, res: Response): Promise<Response> {
    const result = await this.matchService.getLeaderBoard('home');

    return res.status(200).json(result);
  }

  async getScoreAway(_req: Request, res: Response): Promise<Response> {
    const result = await this.matchService.getLeaderBoard('away');

    return res.status(200).json(result);
  }

  async getScoreGeneral(_req: Request, res: Response): Promise<Response> {
    const result = await this.matchLeaderboard.getLeaderBoardGeneral();

    return res.status(200).json(result);
  }
}
