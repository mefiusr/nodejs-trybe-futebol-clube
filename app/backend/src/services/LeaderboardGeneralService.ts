import { ITeamLeaderBoard } from '../interfaces/ITeam';
import LeaderboardService from './LeaderboardService';

export default class LeaderboardGeneralService {
  constructor(
    private matchService = new LeaderboardService(),
  ) { }

  static setScoreGeneralBoard(teamHome: ITeamLeaderBoard, teamAway: ITeamLeaderBoard) {
    const totalPoints = teamHome.totalPoints + teamAway.totalPoints;
    const totalGames = teamHome.totalGames + teamAway.totalGames;
    const goalsFavor = teamHome.goalsFavor + teamAway.goalsFavor;
    const goalsOwn = teamHome.goalsOwn + teamAway.goalsOwn;

    const obj = {
      name: teamHome.name,
      totalPoints,
      totalGames,
      totalVictories: teamHome.totalVictories + teamAway.totalVictories,
      totalDraws: teamHome.totalDraws + teamAway.totalDraws,
      totalLosses: teamHome.totalLosses + teamAway.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: ((totalPoints / (totalGames * 3)) * 100).toFixed(2),
    };
    return obj;
  }

  async getLeaderBoardGeneral(): Promise<ITeamLeaderBoard[]> {
    const scoreHome = await this.matchService.getLeaderBoard();
    const scoreAway = await this.matchService.getLeaderBoardAway();

    const scoreGeneralBoard = scoreHome.map((team) => {
      const filtred = scoreAway.find((e) => team.name === e.name);

      return LeaderboardGeneralService.setScoreGeneralBoard(team, filtred as ITeamLeaderBoard);
    });

    return LeaderboardService.sortScore(scoreGeneralBoard);
  }
}
