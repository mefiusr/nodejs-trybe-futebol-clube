import MatcheService from './MatchService';
import TeamsService from './TeamsService';
import { ITeamLeaderBoard } from '../interfaces/ITeam';

export default class LeaderboardService {
  constructor(
    private matchesModel = new MatcheService(),
    private teamModel = new TeamsService(),
  ) {}

  async getNamesHome(idTeamHome: string): Promise<string | undefined> {
    const nameTeam = await this.teamModel.getTeamById(idTeamHome);
    return nameTeam?.teamName;
  }

  async getTotalGamesHome(idTeamHome: number): Promise<number> {
    const data = await this.matchesModel.getMatchesFinished();
    const totalGames = data.filter((game) => game.homeTeam === idTeamHome);
    return totalGames.length;
  }

  async getLeaderHome() {
    const matchesFinished = await this.matchesModel.getMatchesFinished();
    const array: ITeamLeaderBoard[] = [];
    matchesFinished.forEach(async (match) => {
      const obj = {
        name: await this.getNamesHome((match.homeTeam).toString()),
        totalPoints: 9,
        totalGames: await this.getTotalGamesHome(match.homeTeam),
        totalVictories: 3,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 9,
        goalsOwn: 2,
        goalsBalance: 4,
        efficiency: '100.00',
      };
      array.push(obj as ITeamLeaderBoard);
    });
    // await Promise.all(array as ITeamLeaderBoard[]);

    return array;
  }
}
