import jwt from 'jsonwebtoken';
import pool from '../../database/database';
import { bcryptConfigs, JWTSecret } from '../../enviroment-variables';
import { passwordsMatch } from '../../utils/utilities';

export class AuthenticationService {
  async authenticate(email: string, password: string): Promise<string> {
    try {
      const isValidCred = await this.checkValidCredentials(email, password);
      if (isValidCred) {
        return jwt.sign({ email, password }, JWTSecret);
      } else {
        throw new Error('Wrong Credentails');
      }
    } catch (error) {
      throw new Error(`Error authenticating user`);
    }
  }

  private async checkValidCredentials(email: string, password: string): Promise<boolean> {
    try {
      const db = await pool.connect();
      const sql = 'SELECT user_password FROM users WHERE email = ($1)';
      const result = await db.query(sql, [email]);
      db.release();
      if (result.rows.length) {
        const user = result.rows[0];
        return passwordsMatch(password + bcryptConfigs.pepper, user.user_password);
      } else {
        throw new Error('Wrong Credentails');
      }
    } catch (error) {
      throw new Error(`Wrong Credentails`);
    }
  }
}
