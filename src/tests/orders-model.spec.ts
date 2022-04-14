import pool from '../database/database';
import { OrderModel } from '../models/order/order.model';
import { Order } from '../models/order/order.type';
import { ProductModel } from '../models/product/product.model';
import { Product } from '../models/product/product.type';
import { UserModel } from '../models/user/user.model';
import { User } from '../models/user/user.type';

describe('Test Order Model', () => {
  const orderModel = new OrderModel();

  it('should have an index method', () => {
    expect(orderModel.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderModel.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderModel.create).toBeDefined();
  });

  const productModel = new ProductModel();
  const userModel = new UserModel();

  const product: Product = {
    name: 'TestProduct1',
    price: 2000,
    category: 'testCategory'
  } as Product;

  const user: User = {
    firstname: 'Test',
    lastname: 'Last',
    email: 'test@email.com',
    password: 'pass123'
  } as User;

  beforeAll(async () => {
    product.id = await productModel.create(product);
    user.id = await userModel.create(user);
  });

  afterAll(async () => {
    // clean db
    const connection = await pool.connect();

    const sqlOrdersProducts =
      'DELETE FROM order_product;\
    ALTER SEQUENCE order_product_id_seq RESTART WITH 1';
    await connection.query(sqlOrdersProducts);

    const sqlOrders = 'DELETE FROM orders;\
        ALTER SEQUENCE orders_id_seq RESTART WITH 1';
    await connection.query(sqlOrders);

    const sqlProducts =
      'DELETE FROM products;\
            ALTER SEQUENCE products_id_seq RESTART WITH 1';
    await connection.query(sqlProducts);

    const sqlUsers = 'DELETE FROM users;\
        ALTER SEQUENCE users_id_seq RESTART WITH 1';
    await connection.query(sqlUsers);

    connection.release();
  });

  it('Model should create order', async () => {
    const order: Order = {
      userId: user.id ? user.id : 0,
      status: 'active',
      products: [
        {
          productId: product.id ? product.id : 0,
          quantity: 20
        }
      ]
    };
    const orderCreatedId = await orderModel.create(order);
    expect(orderCreatedId).toBe(1);
  });

  it('Model should retrieve all orders', async () => {
    const orders = await orderModel.index();
    expect(orders.length).toBe(1);
  });

  it('Model should retrieve order with given id 1', async () => {
    const order = await orderModel.show('1');
    expect(order.length).toBe(1);
    expect(order[0].orderId).toBe(1);
    expect(order[0].orderStatus).toBe('active');
    expect(order[0].productId).toBe(1);
  });
});
