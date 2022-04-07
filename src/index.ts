import express, { Application } from 'express';
import morgan from 'morgan';
import routes from './routes';

import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const PORT = process.env.PORT || 3000;
// create an instance server
const app: Application = express();
// HTTP request logger middleware
app.use(morgan('short'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// add routing for / path
app.use('/mystore', routes);

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at port:${PORT}`);
});

export default app;
