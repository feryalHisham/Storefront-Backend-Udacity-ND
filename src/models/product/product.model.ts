import pool from '../../database/database';
import { Product } from './product.type';

export class ProductModel {
  async index(): Promise<Product[]> {
    try {
      const db = await pool.connect();
      const sql = 'SELECT * FROM products';
      const result = await db.query(sql);
      db.release();
      return result.rows;
    } catch (error) {
      throw new Error('Error retreiving products');
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const db = await pool.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await db.query(sql, [id]);
      db.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error retreiving product with id ${id}`);
    }
  }
}
