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

  async getTotalDrawsHome(idTeamHome: number): Promise<number> {
    const totalPoints = await this.getTotalPointsHome(idTeamHome);
    const totalVictories = Math.trunc(totalPoints / 3);
    const totalDraws = totalPoints - (totalVictories * 3);
    return totalDraws;
  }

  async getTotalLossesHome(idTeamHome: number): Promise<number> {
    const totalPoints = await this.getTotalPointsHome(idTeamHome);
    const totalGames = await this.getTotalGamesHome(idTeamHome);
    const totalDraws = await this.getTotalDrawsHome(idTeamHome);
    const totalVictories = Math.trunc(totalPoints / 3);
    const totalLosses = totalGames.length - totalVictories - totalDraws;
    return totalLosses;
  }

  async getGoalsFavorHome(idTeamHome: number): Promise<number> {
    const totalGames = await this.getTotalGamesHome(idTeamHome);
    const totalGoalsFavor = totalGames.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);
    return totalGoalsFavor;
  }

  async getGoalsOwnsHome(idTeamHome: number): Promise<number> {
    const totalGames = await this.getTotalGamesHome(idTeamHome);
    const totalGoalsOwn = totalGames.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);
    return totalGoalsOwn;
  }

  async getLeaderHome(): Promise<ITeamLeaderBoard[]> {
    const matchesFinished = await this.matchesModel.getMatchesFinished();
    return this.getScoreHome(matchesFinished);
  }

  async getGoalsBalanceHome(idTeamHome: number): Promise<number> {
    const goalsFavor = await this.getGoalsFavorHome(idTeamHome);
    const goalsOwn = await this.getGoalsOwnsHome(idTeamHome);
    const goalsBalance = goalsFavor - goalsOwn;
    return goalsBalance;
  }

  async getEfficiencyHome(idTeamHome: number): Promise<number> {
    const points = await this.getTotalPointsHome(idTeamHome);
    const games = (await this.getTotalGamesHome(idTeamHome)).length;
    const eff = points / (games * 3);
    const efficiency = eff * 100;
    return efficiency;
  }

  async getScoreHome(matchesFinished: IMatch[]) {
    const leaderHome: ITeamLeaderBoard[] = [];

    const result = matchesFinished.map(async (match) => {
      const obj = {
        name: await this.getNamesHome((match.homeTeam).toString()),
        totalPoints: await this.getTotalPointsHome(match.homeTeam),
        totalGames: (await this.getTotalGamesHome(match.homeTeam)).length,
        totalVictories: Math.trunc((await this.getTotalPointsHome(match.homeTeam)) / 3),
        totalDraws: await this.getTotalDrawsHome(match.homeTeam),
        totalLosses: await this.getTotalLossesHome(match.homeTeam),
        goalsFavor: await this.getGoalsFavorHome(match.homeTeam),
        goalsOwn: await this.getGoalsOwnsHome(match.homeTeam),
        goalsBalance: await this.getGoalsBalanceHome(match.homeTeam),
        efficiency: (await this.getEfficiencyHome(match.homeTeam)).toFixed(2),
      };

      leaderHome.push(obj as unknown as ITeamLeaderBoard);
    });

    await Promise.all(result);

    return leaderHome;
  }
}
