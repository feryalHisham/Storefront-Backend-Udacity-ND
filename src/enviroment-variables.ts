import * as dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  ENV,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  PEPPER,
  SALT_ROUNDS
} = process.env;

export const DBConfigs = {
  postgresHost: POSTGRES_HOST,
  postgrasDB: ENV === 'DEV' ? POSTGRES_DB : POSTGRES_DB_TEST,
  postgresUser: POSTGRES_USER,
  postgressPassword: POSTGRES_PASSWORD
};

export const ServerPost = PORT;

export const env = ENV;

export const bcryptConfigs = {
  pepper: PEPPER,
  salt: parseInt(SALT_ROUNDS as unknown as string)
};
