import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';
import Match from '../database/models/Match';

export default class MatcheService {
  constructor(private matcheModel: ModelStatic<Match> = Match) {}

  async getAllMatches() {
    const matches = this.matcheModel.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }
}
