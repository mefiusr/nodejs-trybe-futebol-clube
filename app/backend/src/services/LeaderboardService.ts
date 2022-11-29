import MatcheService from './MatchService';
import TeamsService from './TeamsService';
import { ITeamLeaderBoard } from '../interfaces/ITeam';
import IMatch from '../interfaces/IMatch';

export default class LeaderboardService {
  constructor(
    private matchesModel = new MatcheService(),
    private teamModel = new TeamsService(),
  ) {}

  async getNamesHome(idTeamHome: string): Promise<string | undefined> {
    const teams = await this.teamModel.getTeamById(idTeamHome);
    return teams?.teamName;
  }

  async getTotalGamesHome(idTeamHome: number): Promise<IMatch[]> {
    const data = await this.matchesModel.getMatchesFinished();
    const totalGames = data.filter((game) => game.homeTeam === idTeamHome);

    return totalGames;
  }

  async getTotalPointsHome(idTeamHome: number): Promise<number> {
    const data = await this.getTotalGamesHome(idTeamHome);
    const totalPoints = data
      .reduce((acc, curr) => {
        if (curr.homeTeamGoals > curr.awayTeamGoals) {
          return acc + 3;
        } if (curr.homeTeamGoals === curr.awayTeamGoals) {
          return acc + 1;
        }
        return acc;
      }, 0);

    return totalPoints;
  }

  async getLeaderHome() {
    const matchesFinished = await this.matchesModel.getMatchesFinished();
    const leaderHome: ITeamLeaderBoard[] = [];

    const result = matchesFinished.map(async (match) => {
      const obj = {
        name: await this.getNamesHome((match.homeTeam).toString()),
        totalPoints: await this.getTotalPointsHome(match.homeTeam),
        totalGames: (await this.getTotalGamesHome(match.homeTeam)).length,
        totalVictories: 3,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 9,
        goalsOwn: 2,
      };

      leaderHome.push(obj as unknown as ITeamLeaderBoard);
      return obj;
    });

    await Promise.all(result);

    return leaderHome;
  }
}
