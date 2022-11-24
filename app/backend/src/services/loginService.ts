import { compareSync } from 'bcryptjs';
import { ModelStatic } from 'sequelize';
import * as dotenv from 'dotenv';
import HttpException from '../utils/http.exception';
import TokenGenerate from '../utils/tokenGenerate';
import Login from './Login';
import Users from '../database/models/Users';
import { ILogin } from '../interfaces/interface.login';

dotenv.config();

export default class LoginService extends Login<ILogin> {
  constructor(private loginModel: ModelStatic<Users> = Users) {
    super();
  }

  static validatePassword(user: Users | null, password: string): void {
    if (!user || !compareSync(password, user.password)) {
      throw new HttpException(401, 'Incorrect email or password');
    }
  }

  async login(email: string, password: string) {
    const user = await this.loginModel.findOne({ where: { email } });
    LoginService.validatePassword(user, password);
    return { status: 200, message: TokenGenerate.generateToken(email) };
  }

  async getRole(email: string) {
    const role = await this.loginModel.findOne({ where: { email } });

    if (role) {
      return role.role;
    }
  }
}
