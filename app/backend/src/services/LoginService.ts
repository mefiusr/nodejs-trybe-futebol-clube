import * as bcrypt from 'bcryptjs';
import { ModelStatic } from 'sequelize';
import HttpException from '../utils/http.exception';
import TokenGenerate from '../utils/tokenGenerate';
import Login from './Login';
import User from '../database/models/User';
import { ILogin } from '../interfaces/interface.login';

export default class LoginService extends Login<ILogin> {
  constructor(private loginModel: ModelStatic<User> = User) {
    super();
  }

  static validatePassword(user: User | null, password: string): void {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new HttpException(401, 'Incorrect email or password');
    }
  }

  async login(email: string, password: string): Promise<{ status: number, message: string }> {
    const user = await this.loginModel.findOne({ where: { email } });

    LoginService.validatePassword(user, password);
    return { status: 200, message: TokenGenerate.generateToken(email) };
  }

  async getRole(email: string): Promise<string | undefined> {
    const role = await this.loginModel.findOne({ where: { email } });

    if (role) {
      return role.role;
    }
  }
}
