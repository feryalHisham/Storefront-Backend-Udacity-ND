import express from 'express';
import prouductsRoute from './handlers/products';
import usersRoute from './handlers/users';

const routes = express.Router();

// When browser requests 'resizeImage' route the resizeImageRoute will handle it
routes.use('/products', prouductsRoute);
routes.use('/users', usersRoute);

export default routes;
