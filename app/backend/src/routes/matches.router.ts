import { Router } from 'express';
import MatcheController from '../controllers/MatcheController';

const matchesController = new MatcheController();
const matcheRouter = Router();

matcheRouter.get('/', (req, res) => matchesController.getAllTeams(req, res));

export default matcheRouter;
