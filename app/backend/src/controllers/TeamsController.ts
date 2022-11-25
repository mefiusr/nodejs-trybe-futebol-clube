import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  constructor(private teamsService = new TeamsService()) {}

  async getAllTeams(_req: Request, res: Response): Promise<Response> {
    const teams = await this.teamsService.getAllTeams();
    return res.status(200).json(teams);
  }

  async getTeamById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const team = await this.teamsService.getTeamById(id);
    return res.status(200).json(team);
  }
}
