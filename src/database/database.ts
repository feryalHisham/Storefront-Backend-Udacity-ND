import { Pool } from 'pg';
import { DBConfigs } from '../enviroment-variables';

// Create instance of DB

const pool = new Pool({
  host: DBConfigs.postgresHost,
  database: DBConfigs.postgrasDB,
  user: DBConfigs.postgresUser,
  password: DBConfigs.postgressPassword
});

pool.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.log('Error on Connection to BD', error);
});

export default pool;
