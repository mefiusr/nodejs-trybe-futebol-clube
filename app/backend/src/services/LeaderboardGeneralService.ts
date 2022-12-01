import { ITeamLeaderBoard } from '../interfaces/ITeam';
import LeaderboardService from './LeaderboardService';

export default class LeaderboardGeneralService {
  constructor(
    private matchService = new LeaderboardService(),
  ) { }

  static setScoreGeneralBoard(teamHome: ITeamLeaderBoard, sameTeam: ITeamLeaderBoard) {
    const totalPoints = teamHome.totalPoints + sameTeam.totalPoints;
    const totalGames = teamHome.totalGames + sameTeam.totalGames;
    const goalsFavor = teamHome.goalsFavor + sameTeam.goalsFavor;
    const goalsOwn = teamHome.goalsOwn + sameTeam.goalsOwn;

    const obj = {
      name: teamHome.name,
      totalPoints,
      totalGames,
      totalVictories: teamHome.totalVictories + sameTeam.totalVictories,
      totalDraws: teamHome.totalDraws + sameTeam.totalDraws,
      totalLosses: teamHome.totalLosses + sameTeam.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: ((totalPoints / (totalGames * 3)) * 100).toFixed(2),
    };
    return obj;
  }

  async getLeaderBoardGeneral(): Promise<ITeamLeaderBoard[]> {
    const scoreHome = await this.matchService.getLeaderBoard('home');
    const scoreAway = await this.matchService.getLeaderBoard('away');

    const scoreGeneralBoard = scoreHome.map((team) => {
      const sameTeam = scoreAway.find((e) => team.name === e.name);

      return LeaderboardGeneralService.setScoreGeneralBoard(team, sameTeam as ITeamLeaderBoard);
    });

    return LeaderboardService.sortScore(scoreGeneralBoard);
  }
}
