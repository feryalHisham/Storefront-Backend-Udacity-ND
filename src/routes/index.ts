import express from 'express';
import prouductsRoute from './handlers/products';

const routes = express.Router();

// When browser requests 'resizeImage' route the resizeImageRoute will handle it
routes.use('/products', prouductsRoute);

export default routes;
