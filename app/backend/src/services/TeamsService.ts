import { ModelStatic } from 'sequelize';
import { ITeam } from '../interfaces/ITeam';
import Team from '../database/models/Team';

export default class TeamsService {
  constructor(private teamModel: ModelStatic<Team> = Team) {}

  async getAllTeams(): Promise<ITeam[]> {
    const teams = this.teamModel.findAll();

    return teams;
  }

  async getTeamById(id: number): Promise<ITeam | null> {
    const team = await this.teamModel.findByPk(id);
    return team;
  }
}
