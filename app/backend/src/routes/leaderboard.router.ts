import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();
const leaderBoardRouter = Router();

leaderBoardRouter.get('/home', (req, res) => leaderboardController.getMatches(req, res));

export default leaderBoardRouter;
