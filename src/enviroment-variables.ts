import * as dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  ENV,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD
} = process.env;

export const DBConfigs = {
  postgresHost: POSTGRES_HOST,
  postgrasDB: ENV === 'DEV' ? POSTGRES_DB : POSTGRES_DB_TEST,
  postgresUser: POSTGRES_USER,
  postgressPassword: POSTGRES_PASSWORD
};

export const ServerPost = PORT;

export const env = ENV;
