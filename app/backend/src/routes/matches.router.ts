import { Router } from 'express';
import matcheValidation from '../middlewares/matcheValidation';
import MatchController from '../controllers/MatchController';
import tokenValidation from '../middlewares/tokenValidation';

const matchsController = new MatchController();
const matchRouter = Router();

matchRouter.get('/', (req, res) => matchsController.getMatches(req, res));
matchRouter.post(
  '/',
  matcheValidation,
  tokenValidation,
  (req, res) => matchsController.insertNewMatches(req, res),
);
matchRouter.patch('/:id/finish', (req, res) => matchsController.updateMatchProgress(req, res));

export default matchRouter;
