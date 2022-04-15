import express from 'express';
import verifyJWT from '../middlewares/verify-jwt.middleware';
import authRoute from './handlers/authenticate';
import ordersRoute from './handlers/orders';
import prouductsRoute from './handlers/products';
import usersRoute from './handlers/users';
import usersOrders from './handlers/users-orders';

const routes = express.Router();

// When browser requests 'resizeImage' route the resizeImageRoute will handle it
routes.use('/products', prouductsRoute);
routes.use('/users', usersRoute);
routes.use('/orders', verifyJWT, ordersRoute);
routes.use('/userorders', verifyJWT, usersOrders);
routes.use('/authenticate', authRoute);
export default routes;
