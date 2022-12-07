import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

export default class TokenGenerate {
  static generateToken(email: string) {
    const payload = { email };

    return jwt.sign(payload, process.env.JWTSECRET as string, {
      algorithm: 'HS256', expiresIn: '1d' });
  }
}
