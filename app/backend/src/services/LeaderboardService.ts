// import Team from '../database/models/Team';
import MatcheService from './MatchService';
import TeamsService from './TeamsService';

export default class LeaderboardService {
  constructor(
    private matchesModel = new MatcheService(),
    private teamModel = new TeamsService(),
  ) {}

  async getLeaderHome() {
    const matchesFinished = await this.matchesModel.getMatchesFinished();

    const filterHome = matchesFinished.map((match) => {
      const obj = {
        name: match.dataValues.homeTeam,
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
      // const teamsHome = await this.teamModel.getTeamById(match.homeTeam);
      return obj;
    });
    return filterHome;
  }
}
