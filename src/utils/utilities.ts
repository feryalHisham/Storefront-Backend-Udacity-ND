import bcrypt from 'bcrypt';
import { bcryptConfigs } from '../enviroment-variables';

export const encrypt = (password: string): string => {
  return bcrypt.hashSync(password + bcryptConfigs.pepper, bcryptConfigs.salt);
};
