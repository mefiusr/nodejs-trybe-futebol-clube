import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  constructor(private teamsService = new TeamsService()) {}

  async getAllTeams(req: Request, res: Response): Promise<Response> {
    const teams = await this.teamsService.getAllTeams();
    return res.status(200).json(teams);
  }
}
