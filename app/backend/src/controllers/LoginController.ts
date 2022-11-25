import { Request, Response } from 'express';
import LoginService from '../services/LoginService';

export default class LoginController {
  constructor(private loginService = new LoginService()) {}

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const { status, message } = await this.loginService.login(email, password);

    return res.status(status).json({ token: message });
  }

  async getRole(req: Request, res: Response): Promise<Response> {
    const { email } = req.body.user;

    const role = await this.loginService.getRole(email);
    return res.status(200).json({ role });
  }
}
