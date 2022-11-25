import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatcheController {
  constructor(private matchService = new MatchService()) {}

  async getAllTeams(_req: Request, res: Response): Promise<Response> {
    const matches = await this.matchService.getAllMatches();
    return res.status(200).json(matches);
  }

  async getMatchesInProgress(req: Request, res: Response): Promise<Response> {
    const { q } = req.query;
    const matchesInProgress = await this.matchService.getMatchesInProgress(q as string);
    return res.status(200).json(matchesInProgress);
  }
}
