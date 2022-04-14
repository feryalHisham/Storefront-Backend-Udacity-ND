import pool from '../database/database';

import { UserModel } from '../models/user/user.model';
import { User } from '../models/user/user.type';

describe('Test User Model', () => {
  const userModel = new UserModel();

  it('should have an index method', () => {
    expect(userModel.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(userModel.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(userModel.create).toBeDefined();
  });

  afterAll(async () => {
    // clean db
    const connection = await pool.connect();
    const sql = 'DELETE FROM users;\
        ALTER SEQUENCE users_id_seq RESTART WITH 1';
    await connection.query(sql);
    connection.release();
  });

  it('Model should create user', async () => {
    const user: User = {
      firstname: 'Test',
      lastname: 'Last',
      email: 'test@email.com',
      password: 'pass123'
    } as User;

    const userCreatedId = await userModel.create(user);
    expect(userCreatedId).toBe(1);
  });

  it('Model should retrieve all users', async () => {
    const users = await userModel.index();
    expect(users.length).toBe(1);
  });

  it('Model should retrieve user with given id 1', async () => {
    const user = await userModel.show('1');
    expect(user.id).toBe(1);
    expect(user.firstname).toBe('Test');
    expect(user.lastname).toBe('Last');
    expect(user.email).toBe('test@email.com');
    expect(user.password).toBeFalsy();
  });
});
