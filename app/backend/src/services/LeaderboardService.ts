import MatcheService from './MatchService';
import TeamsService from './TeamsService';
import { ITeamLeaderBoard } from '../interfaces/ITeam';
import IMatch from '../interfaces/IMatch';

export default class LeaderboardService {
  constructor(
    private matchesModel = new MatcheService(),
    private teamModel = new TeamsService(),
  ) { }

  async getNames(idTeam: string): Promise<string | undefined> {
    const teams = await this.teamModel.getTeamById(idTeam);
    return teams?.teamName;
  }

  async getTotalGamesHome(idTeamHome: number): Promise<IMatch[]> {
    const data = await this.matchesModel.getMatchesFinished();
    const totalGames = data.filter((game) => game.homeTeam === idTeamHome);

    return totalGames;
  }

  async getTotalPointsHome(idTeamHome: number): Promise<number> {
    const data = await this.getTotalGamesHome(idTeamHome);
    const totalPoints = data.reduce((acc, curr) => {
      if (curr.homeTeamGoals > curr.awayTeamGoals) {
        return acc + 3;
      }
      if (curr.homeTeamGoals === curr.awayTeamGoals) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return totalPoints;
  }

  async getTotalDrawsHome(idTeamHome: number): Promise<number> {
    const totalPoints = await this.getTotalPointsHome(idTeamHome);
    const totalVictories = Math.trunc(totalPoints / 3);
    const totalDraws = totalPoints - totalVictories * 3;
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
    const totalGoalsFavor = totalGames.reduce(
      (acc, curr) => acc + curr.homeTeamGoals,
      0,
    );
    return totalGoalsFavor;
  }

  async getGoalsOwnsHome(idTeamHome: number): Promise<number> {
    const totalGames = await this.getTotalGamesHome(idTeamHome);
    const totalGoalsOwn = totalGames.reduce(
      (acc, curr) => acc + curr.awayTeamGoals,
      0,
    );
    return totalGoalsOwn;
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

  private static sortScore(leaderHome: ITeamLeaderBoard[]): ITeamLeaderBoard[] {
    return leaderHome.sort(
      (a, b) =>
        b.totalPoints - a.totalPoints
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || a.goalsOwn - b.goalsOwn,
    );
  }

  async getLeaderBoard(): Promise<ITeamLeaderBoard[]> {
    const setResult = new Set();

    const leaderHome = await this.getLeaderHome();

    const boardLeader = leaderHome.filter((item) => {
      const duplicatedTeam = setResult.has(item.name);
      setResult.add(item.name);
      return !duplicatedTeam;
    });
    return LeaderboardService.sortScore(boardLeader);
  }

  async getLeaderHome(): Promise<ITeamLeaderBoard[]> {
    const matchesFinished = await this.matchesModel.getMatchesFinished();
    return this.getScoreHome(matchesFinished);
  }

  async getScoreHome(matchesFinished: IMatch[]) {
    const leaderHome: ITeamLeaderBoard[] = [];

    const result = matchesFinished.map(async (match) => {
      const obj = {
        name: await this.getNames(match.homeTeam.toString()),
        totalPoints: await this.getTotalPointsHome(match.homeTeam),
        totalGames: (await this.getTotalGamesHome(match.homeTeam)).length,
        totalVictories: Math.trunc((await this.getTotalPointsHome(match.homeTeam) / 3)),
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

  // LOGICA PARA TIME AWAY
  async getLeaderBoardAway(): Promise<ITeamLeaderBoard[]> {
    const setResult = new Set();

    const leaderAway = await this.getLeaderAway();

    const boardLeader = leaderAway.filter((e) => {
      const duplicatedTeam = setResult.has(e.name);
      setResult.add(e.name);
      return !duplicatedTeam;
    });
    return LeaderboardService.sortScore(boardLeader);
  }

  async getLeaderAway(): Promise<ITeamLeaderBoard[]> {
    const matchesFinished = await this.matchesModel.getMatchesFinished();
    return this.getScoreAway(matchesFinished);
  }

  async getScoreAway(matchesFinished: IMatch[]) {
    const leaderAway: ITeamLeaderBoard[] = [];

    const result = matchesFinished.map(async (match) => {
      const obj = {
        name: await this.getNames(match.awayTeam.toString()),
        totalPoints: await this.getTotalPointsAway(match.awayTeam),
        totalGames: (await this.getTotalGamesAway(match.awayTeam)).length,
        totalVictories: Math.trunc((await this.getTotalPointsAway(match.awayTeam) / 3)),
        totalDraws: await this.getTotalDrawsAway(match.awayTeam),
        totalLosses: await this.getTotalLossesAway(match.awayTeam),
        goalsFavor: await this.getGoalsFavorAway(match.awayTeam),
        goalsOwn: await this.getGoalsOwnsAway(match.awayTeam),
        goalsBalance: await this.getGoalsBalanceAway(match.awayTeam),
        efficiency: (await this.getEfficiencyAway(match.awayTeam)).toFixed(2),
      };

      leaderAway.push(obj as unknown as ITeamLeaderBoard);
    });
    await Promise.all(result);
    return leaderAway;
  }

  async getTotalGamesAway(idTeamAway: number): Promise<IMatch[]> {
    const data = await this.matchesModel.getMatchesFinished();
    const totalGames = data.filter((game) => game.awayTeam === idTeamAway);
    return totalGames;
  }

  async getTotalPointsAway(idTeamAway: number): Promise<number> {
    const data = await this.getTotalGamesAway(idTeamAway);
    const totalPoints = data.reduce((acc, curr) => {
      if (curr.awayTeamGoals > curr.homeTeamGoals) {
        return acc + 3;
      }
      if (curr.awayTeamGoals === curr.homeTeamGoals) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return totalPoints;
  }

  async getTotalDrawsAway(idTeamAway: number): Promise<number> {
    const totalPoints = await this.getTotalPointsAway(idTeamAway);
    const totalVictories = Math.trunc(totalPoints / 3);
    const totalDraws = totalPoints - totalVictories * 3;
    return totalDraws;
  }

  async getTotalLossesAway(idTeamAway: number): Promise<number> {
    const totalPoints = await this.getTotalPointsAway(idTeamAway);
    const totalGames = await this.getTotalGamesAway(idTeamAway);
    const totalDraws = await this.getTotalDrawsAway(idTeamAway);
    const totalVictories = Math.trunc(totalPoints / 3);
    const totalLosses = totalGames.length - totalVictories - totalDraws;
    return totalLosses;
  }

  async getGoalsFavorAway(idTeamAway: number): Promise<number> {
    const totalGames = await this.getTotalGamesAway(idTeamAway);
    const totalGoalsFavor = totalGames.reduce(
      (acc, curr) => acc + curr.awayTeamGoals,
      0,
    );
    return totalGoalsFavor;
  }

  async getGoalsOwnsAway(idTeamAway: number): Promise<number> {
    const totalGames = await this.getTotalGamesAway(idTeamAway);
    const totalGoalsOwn = totalGames.reduce(
      (acc, curr) => acc + curr.homeTeamGoals,
      0,
    );
    return totalGoalsOwn;
  }

  async getGoalsBalanceAway(idTeamAway: number): Promise<number> {
    const goalsFavor = await this.getGoalsFavorAway(idTeamAway);
    const goalsOwn = await this.getGoalsOwnsAway(idTeamAway);
    const goalsBalance = goalsFavor - goalsOwn;
    return goalsBalance;
  }

  async getEfficiencyAway(idTeamAway: number): Promise<number> {
    const points = await this.getTotalPointsAway(idTeamAway);
    const games = (await this.getTotalGamesAway(idTeamAway)).length;
    const eff = points / (games * 3);
    const efficiency = eff * 100;
    return efficiency;
  }
}
