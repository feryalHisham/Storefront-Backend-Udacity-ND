import express, { NextFunction } from 'express';
import { AuthenticationService } from '../../services/authentication/authentication.service';

const authRoute = express.Router();
const authenticationService = new AuthenticationService();

authRoute.post(
  '/',
  async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      if (req.body) {
        const jwt = await authenticationService.authenticate(req.body.email, req.body.password);
        res.json(jwt);
      } else {
        throw new Error('Request body is missing');
      }
    } catch (error) {
      next(error);
    }
  }
);

export default authRoute;
