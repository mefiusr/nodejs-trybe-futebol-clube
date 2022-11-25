import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';

export default class TeamsService {
  constructor(private teamModel: ModelStatic<Team> = Team) {}

  async getAllTeams() {
    const teams = this.teamModel.findAll();

    return teams;
  }

  async getTeamById(id: string) {
    const team = this.teamModel.findByPk(id);
    return team;
  }
}
