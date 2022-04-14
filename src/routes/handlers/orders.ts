import express, { NextFunction } from 'express';
import { OrderModel } from '../../models/order/order.model';
import { Order } from '../../models/order/order.type';

const ordersRoute = express.Router();
const orderModel = new OrderModel();

ordersRoute.get(
  '/',
  async (_req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const ordersList = await orderModel.index();
      res.json(ordersList);
    } catch (error) {
      next(error);
    }
  }
);

ordersRoute.get(
  '/:id',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const order = await orderModel.show(req.params.id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

ordersRoute.post(
  '/addorder',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      if (req.body) {
        const newOrder = req.body as unknown as Order;
        const addedOrder = await orderModel.create(newOrder);
        res.json(`Order successfully created with id ${addedOrder}`);
      } else {
        throw new Error('Request body is missing');
      }
    } catch (error) {
      next(error);
    }
  }
);

export default ordersRoute;
