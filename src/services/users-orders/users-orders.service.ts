import pool from '../../database/database';
import { Product } from '../../models/product/product.type';
import { OrderWithProducts } from './order-with-products.type';
import { UserOrders } from './user-orders.type';

export class UsersOrdersService {
  async getOrdersByUser(userId: number): Promise<UserOrders> {
    try {
      const db = await pool.connect();
      const sql =
        'SELECT order_product.order_id, orders.order_status, order_product.product_id, order_product.quantity,\
         products.product_name, products.price, products.category, orders.user_id,\
         users.firstname, users.lastname \
         FROM orders INNER JOIN users ON orders.user_id = users.id \
         INNER JOIN order_product ON orders.id = order_product.order_id \
         INNER JOIN products ON order_product.product_id = products.id \
         WHERE users.id = ($1)\
         ORDER BY order_product.order_id ASC';
      const result = await db.query(sql, [userId]);
      db.release();
      return this.mapToResponse(
        result.rows as unknown as [
          {
            order_id: number;
            order_status: string;
            product_id: number;
            quantity: number;
            product_name: string;
            price: number;
            category: string;
            user_id: number;
            firstname: string;
            lastname: string;
          }
        ]
      );
    } catch (error) {
      throw new Error(`Error retreiving orders: ${error}`);
    }
  }

  private mapToResponse(
    ordersResult: [
      {
        order_id: number;
        order_status: string;
        product_id: number;
        quantity: number;
        product_name: string;
        price: number;
        category: string;
        user_id: number;
        firstname: string;
        lastname: string;
      }
    ]
  ): UserOrders {
    const orders = new Array<OrderWithProducts>();
    const userOrder: UserOrders = {
      userId: ordersResult[0].user_id,
      firstname: ordersResult[0].firstname,
      lastname: ordersResult[0].lastname,
      orders: orders
    };
    ordersResult.forEach((order, index) => {
      const product: Product & { quantity: number } = {
        id: order.product_id,
        name: order.product_name,
        price: order.price,
        category: order.category,
        quantity: order.quantity
      };
      if (index === 0 || order.order_id !== ordersResult[index - 1].order_id) {
        const products = new Array<Product & { quantity: number }>();
        products.push(product);
        const orderWithProducts: OrderWithProducts = {
          orderId: order.order_id,
          orderStatus: order.order_status,
          products: products
        };
        orders.push(orderWithProducts);
      } else {
        // same order so just need to add the produc
        userOrder.orders.find((o) => o.orderId)?.products.push(product);
      }
    });

    return userOrder;
  }
}
