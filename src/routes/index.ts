import express from 'express';
import authRoute from './handlers/authenticate';
import ordersRoute from './handlers/orders';
import prouductsRoute from './handlers/products';
import usersRoute from './handlers/users';
import usersOrders from './handlers/users-orders';

const routes = express.Router();

// When browser requests 'resizeImage' route the resizeImageRoute will handle it
routes.use('/products', prouductsRoute);
routes.use('/users', usersRoute);
routes.use('/orders', ordersRoute);
routes.use('/userorders', usersOrders);
routes.use('/authenticate', authRoute);
export default routes;
