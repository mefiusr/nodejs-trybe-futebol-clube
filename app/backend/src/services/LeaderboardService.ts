// import Team from '../database/models/Team';
// import { ITeamMatch } from '../interfaces/ITeam';
import MatcheService from './MatchService';
import TeamsService from './TeamsService';

export default class LeaderboardService {
  constructor(
    private matchesModel = new MatcheService(),
    private teamModel = new TeamsService(),
  ) {}

  // async getNames(matches: ITeamMatch[]) {
  //   const result = matches
  //     .map((match) => this.teamModel.getTeamById(match.teamHome.teamName));
  //   console.log(result);

  //   return Promise.all(result);
  // }

  async getLeaderHome() {
    const matchesFinished = await this.matchesModel.getAllMatches();

    const filterHome = matchesFinished.map((match) => {
      const obj = {
        name: match.dataValues.teamHome.teamName,
        totalPoints: 9,
        totalGames: 3,
        totalVictories: 3,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 9,
        goalsOwn: 3,
        goalsBalance: 6,
        efficiency: '100.00',
      };
      return obj;
    });
    return filterHome;
  }
}
