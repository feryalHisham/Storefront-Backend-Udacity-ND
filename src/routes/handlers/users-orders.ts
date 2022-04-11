import express, { NextFunction } from 'express';
import { UsersOrdersService } from '../../services/users-orders/users-orders.service';

const usersOrders = express.Router();
const usersOrdersService = new UsersOrdersService();
usersOrders.get(
  '/:userid',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await usersOrdersService.getOrdersByUser(parseInt(req.params.userid));
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

export default usersOrders;
