import supertest from 'supertest';
import app from '../index';
import pool from '../database/database';

import { UserModel } from '../models/user/user.model';
import { User } from '../models/user/user.type';

// create a request object
const request = supertest(app);

describe('Test Users endpoints', () => {
  const userModel = new UserModel();
  let jwt: string;
  beforeAll(async () => {
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
    const sql = 'DELETE FROM users;\
        ALTER SEQUENCE users_id_seq RESTART WITH 1';
    await connection.query(sql);
    connection.release();
  });

  it("Should return status 401 for '/mystore/users' endpoint since no token is passed", async () => {
    const response = await request.get('/mystore/users');
    expect(response.status).toBe(401);
  });

  it('Should authenticate the user successfully', async () => {
    const response = await request
      .post('/mystore/authenticate')
      .send({ email: 'test@email.com', password: 'pass123' });
    expect(response.status).toBe(200);
    jwt = response.body;
  });

  it("Should now return status 200 for '/mystore/users' endpoint since token is passed", async () => {
    const response = await request.get('/mystore/users').set('Authorization', `Bearer ${jwt}`);
    expect(response.status).toBe(200);
  });

  it('Should add user successfully', async () => {
    const user: User = {
      firstname: 'Test2',
      lastname: 'Last',
      email: 'test2@email.com',
      password: 'pass123'
    } as User;

    const response = await request
      .post('/mystore/users/adduser')
      .set('Authorization', `Bearer ${jwt}`)
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body).toEqual('User successfully added with id 2');
  });

  it('Should retrieve user with id 2 successfully', async () => {
    const response = await request.get('/mystore/users/2').set('Authorization', `Bearer ${jwt}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(2);
    expect(response.body.email).toBe('test2@email.com');
    expect(response.body.firstname).toBe('Test2');
    expect(response.body.lastname).toBe('Last');
  });
});
