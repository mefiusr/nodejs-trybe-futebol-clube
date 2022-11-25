import { ModelStatic } from 'sequelize';
import Matche from '../database/models/Matche';

export default class MatcheService {
  constructor(private matcheModel: ModelStatic<Matche> = Matche) {}

  async getAllMatches() {
    const matches = this.matcheModel.findAll();

    return matches;
  }
}
