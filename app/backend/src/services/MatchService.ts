import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';
import Match from '../database/models/Match';

export default class MatcheService {
  constructor(private matcheModel: ModelStatic<Match> = Match) {}

  async getAllMatches() {
    const matches = this.matcheModel.findAll({
      include: [
        { model: Team, as: 'teams', attributes: { exclude: ['id'] } },
        { model: Team, as: 'matches', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }
}
