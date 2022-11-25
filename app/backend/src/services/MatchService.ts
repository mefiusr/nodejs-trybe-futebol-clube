import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';
import Match from '../database/models/Match';

export default class MatcheService {
  constructor(private matchModel: ModelStatic<Match> = Match) {}

  async getAllMatches() {
    const matches = this.matchModel.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  async getMatchesInProgress(inProgress: string) {
    const trueOrFalse = inProgress === 'true';

    if (inProgress) {
      const matchesInProgress = await this.matchModel.findAll({ where: { inProgress: trueOrFalse },
        include: [
          { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
          { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
        ] });
      return matchesInProgress;
    }
  }
}
