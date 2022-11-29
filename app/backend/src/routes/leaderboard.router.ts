import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();
const leaderBoardRouter = Router();

leaderBoardRouter.get('/home', (req, res) => leaderboardController.getScoreHome(req, res));

export default leaderBoardRouter;
