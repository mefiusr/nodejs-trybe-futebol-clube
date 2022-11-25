import { Router } from 'express';
import TeamsController from '../controllers/TeamsController';

const teamsController = new TeamsController();
const teamsRouter = Router();

teamsRouter.get('/', (req, res) => teamsController.getAllTeams(req, res));

export default teamsRouter;
