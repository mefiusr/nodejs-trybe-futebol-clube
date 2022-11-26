import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import tokenValidation from '../middlewares/tokenValidation';

const matchsController = new MatchController();
const matchRouter = Router();

matchRouter.get('/', (req, res) => matchsController.getMatches(req, res));
matchRouter.post('/', tokenValidation, (req, res) => matchsController.insertNewMatches(req, res));

export default matchRouter;
