import { Request, Response } from 'express';
import LoginService from '../services/loginService';

export default class LoginController {
  constructor(private loginService = new LoginService()) {}

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const { status, message } = await this.loginService.login(email, password);

    return res.status(status).json({ token: message });
  }
}
