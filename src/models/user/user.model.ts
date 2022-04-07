import pool from '../../database/database';
import { encrypt } from '../../utils/utilities';
import { User } from './user.type';

export class UserModel {
  async create(user: User): Promise<number> {
    try {
      const db = await pool.connect();
      const sql =
        'INSERT INTO users (firstname, lastname, email, user_password) VALUES ($1, $2, $3, $4) RETURNING id';

      const encryptedPassword = encrypt(user.password);
      const result = await db.query(sql, [
        user.firstname,
        user.lastname,
        user.email,
        encryptedPassword
      ]);
      db.release();
      return result.rows[0].id;
    } catch (error) {
      throw new Error("Couldn't create user");
    }
  }
}
