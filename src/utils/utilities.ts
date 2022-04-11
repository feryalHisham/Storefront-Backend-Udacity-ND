import bcrypt from 'bcrypt';
import { bcryptConfigs } from '../enviroment-variables';

export const encrypt = (password: string): string => {
  return bcrypt.hashSync(password + bcryptConfigs.pepper, bcryptConfigs.salt);
};

export const passwordsMatch = (password1: string, password2: string): boolean => {
  return bcrypt.compareSync(password1, password2);
};
