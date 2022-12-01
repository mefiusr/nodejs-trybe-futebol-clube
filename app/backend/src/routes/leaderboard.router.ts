import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();
const leaderBoardRouter = Router();

// leaderBoardRouter.get('/', (req, res) => leaderboardController.getScoreGeneral(req, res));
leaderBoardRouter.get('/away', (req, res) => leaderboardController.getScoreAway(req, res));
leaderBoardRouter.get('/home', (req, res) => leaderboardController.getScoreHome(req, res));

export default leaderBoardRouter;
