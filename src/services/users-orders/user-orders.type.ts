import { OrderWithProducts } from './order-with-products.type';

export type UserOrders = {
  userId: number;
  firstname: string;
  lastname: string;
  orders: Array<OrderWithProducts>;
};
