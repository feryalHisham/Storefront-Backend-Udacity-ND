import supertest from 'supertest';
import pool from '../database/database';
import app from '../index';
import { ProductModel } from '../models/product/product.model';
import { Product } from '../models/product/product.type';
import { UserModel } from '../models/user/user.model';
import { User } from '../models/user/user.type';

// create a request object
const request = supertest(app);

describe('Test Products endpoints', () => {
  const productModel = new ProductModel();
  const userModel = new UserModel();

  beforeAll(async () => {
    const product: Product = {
      name: 'TestProduct1',
      price: 2000,
      category: 'testCategory'
    } as Product;
    await productModel.create(product);

    const user: User = {
      firstname: 'Test',
      lastname: 'Last',
      email: 'test@email.com',
      password: 'pass123'
    } as User;

    await userModel.create(user);
  });

  afterAll(async () => {
    // clean db
    const connection = await pool.connect();
    const sqlProducts =
      'DELETE FROM products;\
            ALTER SEQUENCE products_id_seq RESTART WITH 1';
    await connection.query(sqlProducts);

    const sqlUsers = 'DELETE FROM users;\
        ALTER SEQUENCE users_id_seq RESTART WITH 1';
    await connection.query(sqlUsers);
    connection.release();
  });

  it('Should return array of products of length with status 200', async () => {
    const response = await request.get('/mystore/products');
    expect(response.status).toBe(200);
    expect((response.body as Product[]).length).toBe(1);
  });

  it('Should return product with id 1 with status 200', async () => {
    const response = await request.get('/mystore/products/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('TestProduct1');
    expect(response.body.price.toString()).toBe(parseFloat('2000.00').toFixed(2));
    expect(response.body.category).toBe('testCategory');
  });

  it("Should return status 401 for '/mystore/products/addproduct' endpoint since no token is passed", async () => {
    const product: Product = {
      name: 'TestProduct2',
      price: 6000,
      category: 'testCategory2'
    } as Product;

    const response = await request.post('/mystore/products/addproduct').send(product);
    expect(response.status).toBe(401);
  });

  it('Should authenticate and add product successfully since token is passed', async () => {
    const product: Product = {
      name: 'TestProduct2',
      price: 6000,
      category: 'testCategory2'
    } as Product;

    const authResponse = await request
      .post('/mystore/authenticate')
      .send({ email: 'test@email.com', password: 'pass123' });
    expect(authResponse.status).toBe(200);

    const jwt = authResponse.body;

    const response = await request
      .post('/mystore/products/addproduct')
      .set('Authorization', `Bearer ${jwt}`)
      .send(product);
    expect(response.status).toBe(200);
  });
});
