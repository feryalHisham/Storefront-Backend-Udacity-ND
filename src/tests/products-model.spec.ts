import pool from '../database/database';
import { ProductModel } from '../models/product/product.model';
import { Product } from '../models/product/product.type';

describe('Test Product Model', () => {
  const productModel = new ProductModel();

  it('should have an index method', () => {
    expect(productModel.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(productModel.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(productModel.create).toBeDefined();
  });

  afterAll(async () => {
    // clean db
    const connection = await pool.connect();
    const sql = 'DELETE FROM products;\
        ALTER SEQUENCE products_id_seq RESTART WITH 1';
    await connection.query(sql);
    connection.release();
  });

  it('Model should create product', async () => {
    const product: Product = {
      name: 'Test Product',
      price: 2000,
      category: 'testCategory'
    } as Product;

    const productCreatedId = await productModel.create(product);
    expect(productCreatedId).toBe(1);
  });

  it('Model should retrieve all products', async () => {
    const products = await productModel.index();
    expect(products.length).toBe(1);
  });

  it('Model should retrieve product with given id 1', async () => {
    const product = await productModel.show('1');
    expect(product.id).toBe(1);
    expect(product.name).toBe('Test Product');
    expect(product.price.toString()).toBe(parseFloat('2000.00').toFixed(2));
    expect(product.category).toBe('testCategory');
  });
});
