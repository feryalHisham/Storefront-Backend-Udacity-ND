import express, { NextFunction } from 'express';
import { ProductModel } from '../../models/product/product.model';
import { Product } from '../../models/product/product.type';

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

prouductsRoute.post(
  '/addproduct',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      if (req.body) {
        const newProduct: Product = {
          name: req.body.name,
          price: req.body.price,
          category: req.body.category
        };
        const addedProduct = await productModel.create(newProduct);
        res.json(`Product successfully added with id ${addedProduct}`);
      } else {
        throw new Error('Request body is missing');
      }
    } catch (error) {
      next(error);
    }
  }
);

export default prouductsRoute;
