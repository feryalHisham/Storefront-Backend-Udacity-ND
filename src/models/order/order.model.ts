import pool from '../../database/database';
import { ProductInOrder } from '../order-product/product-in-order.type';
import { OrderResponse } from './order-response.type';
import { Order } from './order.type';

export class OrderModel {
  async index(): Promise<OrderResponse[]> {
    try {
      const db = await pool.connect();
      const sql =
        'SELECT * FROM orders INNER JOIN order_product ON orders.id = order_product.order_id';
      const result = await db.query(sql);
      db.release();
      return result.rows.map((res) => this.mapToResponse(res));
    } catch (error) {
      throw new Error(`Error retreiving orders: ${error}`);
    }
  }

  async show(id: string): Promise<OrderResponse[]> {
    try {
      const db = await pool.connect();
      const sql =
        'SELECT * FROM orders INNER JOIN order_product ON orders.id = order_product.order_id WHERE orders.id=($1)';
      const result = await db.query(sql, [id]);
      db.release();
      return result.rows.map((res) => this.mapToResponse(res));
    } catch (err) {
      throw new Error(`Error retreiving order with id ${id}`);
    }
  }

  async create(order: Order): Promise<number> {
    try {
      const db = await pool.connect();
      const sql = 'INSERT INTO orders (user_id, order_status) VALUES ($1, $2) RETURNING id';
      const result = await db.query(sql, [order.userId, order.status]);
      db.release();

      order.products.forEach(async (productInOrder) => {
        await this.addProductToOrder(result.rows[0].id, productInOrder);
      });

      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Couldn't create order: ${error}`);
    }
  }

  private async addProductToOrder(orderId: number, product: ProductInOrder): Promise<void> {
    try {
      const db = await pool.connect();
      const sql = 'INSERT INTO order_product (order_id, product_id, quantity) VALUES ($1, $2, $3)';
      await db.query(sql, [orderId, product.productId, product.quantity]);
      db.release();
    } catch (error) {
      throw new Error(`Couldn't add product ${product.productId} to order ${orderId}: ${error}`);
    }
  }

  private mapToResponse(order: {
    id: number;
    user_id: number;
    order_status: string;
    order_id: number;
    product_id: number;
    quantity: number;
  }): OrderResponse {
    const orderResponse: OrderResponse = {
      id: order.id,
      userId: order.user_id,
      productId: order.product_id,
      orderId: order.order_id,
      orderStatus: order.order_status,
      quantity: order.quantity
    };

    return orderResponse;
  }
}
