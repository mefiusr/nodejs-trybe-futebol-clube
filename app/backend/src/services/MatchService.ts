import { ModelStatic } from 'sequelize';
import HttpException from '../utils/http.exception';
import Team from '../database/models/Team';
import Match from '../database/models/Match';
import TeamsService from './TeamsService';
import IMatch from '../interfaces/IMatch';

export default class MatcheService {
  constructor(
    private matchModel: ModelStatic<Match> = Match,
    private teamService = new TeamsService(),
  ) { }

  async getAllMatches(): Promise<IMatch[]> {
    const matches = this.matchModel.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  async getMatchesFinished(): Promise<IMatch[]> {
    const matchesFinisheds = await this.matchModel.findAll({ where: { inProgress: false } });
    return matchesFinisheds;
  }

  async getMatchesInProgress(inProgress: string): Promise<IMatch[] | undefined> {
    const trueOrFalse = inProgress === 'true';

    if (inProgress) {
      const matchesInProgress = await this.matchModel.findAll({
        where: { inProgress: trueOrFalse },
        include: [
          { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
          { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
        ],
      });
      return matchesInProgress;
    }
  }

  async validateTeams(homeTeam: string, awayTeam: string): Promise<void | Error> {
    const home = await this.teamService.getTeamById(homeTeam);
    const away = await this.teamService.getTeamById(awayTeam);

    if (!home || !away) {
      throw new HttpException(404, 'There is no team with such id!');
    }
  }

  async insertNewMatch(
    homeTeam: string,
    awayTeam: string,
    homeTeamGoals: string,
    awayTeamGoals: string,
  ): Promise<number> {
    await this.validateTeams(homeTeam, awayTeam);

    const newMatch = await this.matchModel.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });

    const { id } = newMatch.dataValues;

    return id;
  }

  async updateMatchProgress(id: string): Promise<void> {
    await this.matchModel.update({ inProgress: false }, { where: { id } });
  }

  async updateScoreMatch(id: string, homeTeamGoals: string, awayTeamGoals: string): Promise<void> {
    await this.matchModel.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
  }
}
