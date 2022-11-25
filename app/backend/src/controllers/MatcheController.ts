import { Request, Response } from 'express';
import MatcheService from '../services/Matche';

export default class MatcheController {
  constructor(private matcheService = new MatcheService()) {}

  async getAllTeams(_req: Request, res: Response): Promise<Response> {
    const matches = await this.matcheService.getAllMatches();
    return res.status(200).json(matches);
  }
}
