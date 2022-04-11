import { Product } from '../../models/product/product.type';

// Orders with array of products each product has its complete info ex: name,price, category, quantity
export type OrderWithProducts = {
  orderId: number;
  orderStatus: string;
  products: Array<Product & { quantity: number }>;
};
