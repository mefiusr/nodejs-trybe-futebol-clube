import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export default class TokenGenerate {
  static generateToken(email: string) {
    const payload = { email };

    return sign(payload, process.env.JWT_SECRET as string, {
      algorithm: 'HS256', expiresIn: '1d' });
  }
}
