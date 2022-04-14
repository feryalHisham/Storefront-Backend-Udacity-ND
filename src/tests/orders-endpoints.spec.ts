import supertest from 'supertest';
import pool from '../database/database';
import app from '../index';
import { OrderResponse } from '../models/order/order-response.type';
import { Order } from '../models/order/order.type';
import { ProductModel } from '../models/product/product.model';
import { Product } from '../models/product/product.type';
import { UserModel } from '../models/user/user.model';
import { User } from '../models/user/user.type';
import { UserOrders } from '../services/users-orders/user-orders.type';

// create a request object
const request = supertest(app);

describe('Test Orders endpoints', () => {
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

  let jwt: string;

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

  it("Should return status 401 for '/mystore/orders' endpoint since no token is passed", async () => {
    const response = await request.get('/mystore/orders');
    expect(response.status).toBe(401);
  });

  it('Should authenticate and create order successfully', async () => {
    const authResponse = await request
      .post('/mystore/authenticate')
      .send({ email: 'test@email.com', password: 'pass123' });
    expect(authResponse.status).toBe(200);

    jwt = authResponse.body;

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

    const response = await request
      .post('/mystore/orders/addorder')
      .set('Authorization', `Bearer ${jwt}`)
      .send(order);
    expect(response.status).toBe(200);
  });

  it('Should return array of orders of length 1 with status 200 since token is passed', async () => {
    const response = await request.get('/mystore/orders').set('Authorization', `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect((response.body as OrderResponse[]).length).toBe(1);
  });

  it('Should return order with id 1 with status 200', async () => {
    const response = await request.get('/mystore/orders/1').set('Authorization', `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    const order = response.body[0] as unknown as OrderResponse;
    expect(order.id).toBe(1);
    expect(order.userId).toBe(1);
    expect(order.orderId).toBe(1);
    expect(order.productId).toBe(1);
    expect(order.orderStatus).toBe('active');
    expect(order.quantity).toBe(20);
  });

  it('Should return orders of user with id 1', async () => {
    const response = await request
      .get('/mystore/userorders/1')
      .set('Authorization', `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    const userOrder = response.body as unknown as UserOrders;
    expect(userOrder.userId).toBe(1);
    expect(userOrder.firstname).toBe('Test');
    expect(userOrder.orders.length).toBe(1);
    expect(userOrder.orders[0].orderId).toBe(1);
    expect(userOrder.orders[0].orderStatus).toBe('active');
    expect(userOrder.orders[0].products.length).toBe(1);
    expect(userOrder.orders[0].products[0].id).toBe(1);
    expect(userOrder.orders[0].products[0].name).toBe('TestProduct1');
  });
});
