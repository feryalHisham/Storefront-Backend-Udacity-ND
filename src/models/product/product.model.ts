import pool from '../../database/database';
import { Product } from './product.type';

export class ProductModel {
  async index(): Promise<Product[]> {
    try {
      const db = await pool.connect();
      const sql = 'SELECT id, product_name as name, price, category FROM products';
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
      const sql = 'SELECT id, product_name as name, price, category FROM products WHERE id=($1)';
      const result = await db.query(sql, [id]);
      db.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error retreiving product with id ${id}`);
    }
  }

  async create(product: Product): Promise<number> {
    try {
      const db = await pool.connect();
      const sql =
        'INSERT INTO products (product_name, price, category) VALUES ($1, $2, $3) RETURNING id';

      const result = await db.query(sql, [product.name, product.price, product.category]);
      db.release();
      return result.rows[0].id;
    } catch (error) {
      throw new Error("Couldn't create product");
    }
  }
}
