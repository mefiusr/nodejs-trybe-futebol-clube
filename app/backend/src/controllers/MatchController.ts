import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatcheController {
  constructor(private matchService = new MatchService()) { }

  async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    const isQuery = inProgress === undefined
      ? await this.matchService.getAllMatches()
      : await this.matchService.getMatchesInProgress(inProgress as string);
    return res.status(200).json(isQuery);
  }

  async insertNewMatches(req: Request, res: Response) {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;

    const id = await this.matchService
      .insertNewMatch(homeTeam, awayTeam, homeTeamGoals, awayTeamGoals);

    return res.status(201)
      .json({ id, homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress: true });
  }

  async updateMatchProgress(req: Request, res: Response) {
    const { id } = req.params;

    await this.matchService.updateMatchProgress(id);

    res.status(200).json({ message: 'Finished' });
  }

  async updateScoreMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this.matchService.updateScoreMatch(id, homeTeamGoals, awayTeamGoals);

    res.status(200).json({ message: 'Match updated' });
  }
}
