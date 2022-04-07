import express, { NextFunction } from 'express';
import { ProductModel } from '../../models/product/product.model';

const prouductsRoute = express.Router();
const productModel = new ProductModel();

prouductsRoute.get(
  '/',
  async (_req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const productsList = await productModel.index();
      res.json(productsList);
    } catch (error) {
      next(error);
    }
  }
);

prouductsRoute.get(
  '/:id',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const product = await productModel.show(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

export default prouductsRoute;
