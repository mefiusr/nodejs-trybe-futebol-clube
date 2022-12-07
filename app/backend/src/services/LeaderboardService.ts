import MatcheService from './MatchService';
import TeamsService from './TeamsService';
import { ITeamLeaderBoard } from '../interfaces/ITeam';
import IMatch from '../interfaces/IMatch';

export default class LeaderboardService {
  constructor(
    private matchesModel = new MatcheService(),
    private teamModel = new TeamsService(),
  ) { }

  async getNames(match: IMatch, game: string): Promise<string | undefined> {
    if (game === 'home') {
      const teams = await this.teamModel.getTeamById(match.homeTeam);
      return teams?.teamName;
    }
    const teams = await this.teamModel.getTeamById(match.awayTeam);
    return teams?.teamName;
  }

  async getTotalGames(match: IMatch, game: string): Promise<IMatch[]> {
    const data = await this.matchesModel.getMatchesFinished();
    if (game === 'home') {
      return data.filter((e) => e.homeTeam === match.homeTeam);
    }
    return data.filter((e) => e.awayTeam === match.awayTeam);
  }

  async getTotalPointsHome(match: IMatch, game: string): Promise<number> {
    const data = await this.getTotalGames(match, game);
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

  async getTotalPointsAway(match: IMatch, game: string): Promise<number> {
    const data = await this.getTotalGames(match, game);
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

  async getTotalPoints(match: IMatch, game: string) {
    if (game === 'home') {
      return this.getTotalPointsHome(match, game);
    }
    return this.getTotalPointsAway(match, game);
  }

  async getTotalDraws(match: IMatch, game: string): Promise<number> {
    const totalPoints = await this.getTotalPoints(match, game);
    const totalVictories = Math.trunc(totalPoints / 3);
    const totalDraws = totalPoints - totalVictories * 3;
    return totalDraws;
  }

  async getTotalLosses(match: IMatch, game: string): Promise<number> {
    const totalPoints = await this.getTotalPoints(match, game);
    const totalGames = await this.getTotalGames(match, game);
    const totalDraws = await this.getTotalDraws(match, game);
    const totalVictories = Math.trunc(totalPoints / 3);
    const totalLosses = totalGames.length - totalVictories - totalDraws;
    return totalLosses;
  }

  async getGoalsFavor(match: IMatch, game: string): Promise<number> {
    const totalGames = await this.getTotalGames(match, game);
    if (game === 'home') {
      return totalGames.reduce(
        (acc, curr) => acc + curr.homeTeamGoals,
        0,
      );
    }
    return totalGames.reduce(
      (acc, curr) => acc + curr.awayTeamGoals,
      0,
    );
  }

  async getGoalsOwns(match: IMatch, game: string): Promise<number> {
    const totalGames = await this.getTotalGames(match, game);
    if (game === 'home') {
      return totalGames.reduce(
        (acc, curr) => acc + curr.awayTeamGoals,
        0,
      );
    }
    return totalGames.reduce(
      (acc, curr) => acc + curr.homeTeamGoals,
      0,
    );
  }

  async getGoalsBalance(match: IMatch, game: string): Promise<number> {
    const goalsFavor = await this.getGoalsFavor(match, game);
    const goalsOwn = await this.getGoalsOwns(match, game);
    const goalsBalance = goalsFavor - goalsOwn;
    return goalsBalance;
  }

  async getEfficiency(match: IMatch, game: string): Promise<number> {
    const points = await this.getTotalPoints(match, game);
    const games = (await this.getTotalGames(match, game)).length;
    const eff = points / (games * 3);
    const efficiency = eff * 100;
    return efficiency;
  }

  static sortScore(leadership: ITeamLeaderBoard[]): ITeamLeaderBoard[] {
    return leadership.sort(
      (a, b) =>
        b.totalPoints - a.totalPoints
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || a.goalsOwn - b.goalsOwn,
    );
  }

  async getLeaderBoard(game: string): Promise<ITeamLeaderBoard[]> {
    const setResult = new Set();

    const leaderHome = await this.getLeader(game);

    const boardLeader = leaderHome.filter((item) => {
      const duplicatedTeam = setResult.has(item.name);
      setResult.add(item.name);
      return !duplicatedTeam;
    });
    return LeaderboardService.sortScore(boardLeader);
  }

  async getLeader(game: string): Promise<ITeamLeaderBoard[]> {
    const matchesFinished = await this.matchesModel.getMatchesFinished();
    return this.getScore(matchesFinished, game);
  }

  async getScore(matchesFinished: IMatch[], game: string) {
    const leader: ITeamLeaderBoard[] = [];

    const result = matchesFinished.map(async (match) => {
      const obj = {
        name: await this.getNames(match, game),
        totalPoints: await this.getTotalPoints(match, game),
        totalGames: (await this.getTotalGames(match, game)).length,
        totalVictories: Math.trunc((await this.getTotalPoints(match, game) / 3)),
        totalDraws: await this.getTotalDraws(match, game),
        totalLosses: await this.getTotalLosses(match, game),
        goalsFavor: await this.getGoalsFavor(match, game),
        goalsOwn: await this.getGoalsOwns(match, game),
        goalsBalance: await this.getGoalsBalance(match, game),
        efficiency: (await this.getEfficiency(match, game)).toFixed(2),
      };

      leader.push(obj as unknown as ITeamLeaderBoard);
    });
    await Promise.all(result);
    return leader;
  }
}
