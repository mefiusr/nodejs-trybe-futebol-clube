import 'express-async-errors';
import * as express from 'express';
import httpErrorMiddleware from './middlewares/http.error.middleware';
import loginRouter from './routes/login.router';
import teamsRouter from './routes/teams.router';
import matcheRouter from './routes/matches.router';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();
    this.routes();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
    this.app.use(httpErrorMiddleware);
  }

  private routes():void {
    this.app.use('/login', loginRouter);
    this.app.use('/teams', teamsRouter);
    this.app.use('/matches', matcheRouter);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export default App;
