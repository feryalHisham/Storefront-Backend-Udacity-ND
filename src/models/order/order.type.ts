import { ProductInOrder } from '../order-product/product-in-order.type';

export type Order = {
  id?: number;
  userId: number;
  status: string;
  products: Array<ProductInOrder>;
};
