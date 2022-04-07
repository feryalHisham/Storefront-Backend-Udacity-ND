import express, { NextFunction } from 'express';
import { UserModel } from '../../models/user/user.model';
import { User } from '../../models/user/user.type';

const usersRoute = express.Router();
const userModel = new UserModel();

usersRoute.post(
  '/adduser',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      if (req.body) {
        const newUser: User = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password
        };
        const addedUser = await userModel.create(newUser);
        res.json(`User successfully added with id ${addedUser}`);
      } else {
        throw new Error('Request body is missing');
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRoute.get(
  '/',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const usersList = await userModel.index();
      res.json(usersList);
    } catch (error) {
      next(error);
    }
  }
);

usersRoute.get(
  '/:id',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userModel.show(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRoute;
