import { ITeamLeaderBoard } from '../interfaces/ITeam';
import LeaderboardService from './LeaderboardService';

export default class LeaderboardGeneralService {
  constructor(
    private matchService = new LeaderboardService(),
  ) { }

  static setScoreGeneralBoard(team: ITeamLeaderBoard[]) {
    const totalPoints = team[0].totalPoints + team[1].totalPoints;
    const totalGames = team[0].totalGames + team[1].totalGames;

    const obj = {
      name: team[0].name,
      totalPoints,
      totalGames,
      totalVictories: team[0].totalVictories + team[1].totalVictories,
      totalDraws: team[0].totalDraws + team[1].totalDraws,
      totalLosses: team[0].totalLosses + team[1].totalLosses,
      goalsFavor: team[0].goalsFavor + team[1].goalsFavor,
      goalsOwn: team[0].goalsOwn + team[1].goalsOwn,
      goalsBalance: team[0].goalsBalance + team[1].goalsBalance,
      efficiency: ((totalPoints / (totalGames * 3)) * 100).toFixed(2),
    };
    return obj;
  }

  async getLeaderBoardGeneral(): Promise<ITeamLeaderBoard[]> {
    const scoreHome = await this.matchService.getLeaderBoard();
    const scoreAway = await this.matchService.getLeaderBoardAway();
    const scoreGeneral = [...scoreHome, ...scoreAway];

    const scoreGeneralBoard: ITeamLeaderBoard[] = [];

    scoreHome.forEach((team) => {
      const data = scoreGeneral.filter(({ name }) => team.name === name);

      scoreGeneralBoard.push(LeaderboardGeneralService.setScoreGeneralBoard(data));
    });

    return LeaderboardService.sortScore(scoreGeneralBoard);
  }
}
