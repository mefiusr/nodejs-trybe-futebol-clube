import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';
import Matche from '../database/models/Matche';

export default class MatcheService {
  constructor(private matcheModel: ModelStatic<Matche> = Matche) {}

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
