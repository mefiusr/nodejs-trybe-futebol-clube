import MatcheService from './MatchService';

export default class LeaderboardService {
  constructor(private matchesModel = new MatcheService()) {}

  async getMatchesFinisheds() {
    const matchesFinisheds = await this.matchesModel.getMatchesFinished();
    return matchesFinisheds;
  }
}
