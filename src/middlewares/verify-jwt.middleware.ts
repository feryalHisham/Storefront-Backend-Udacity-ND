import express, { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTSecret } from '../enviroment-variables';

const sendUnAuthorizedResponse = (res: express.Response): void => {
  res.status(401).json('Access Denied. UnAuthorized user.');
};

const verifyJWT = (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWTSecret);
      if (decoded) {
        next();
      } else {
        sendUnAuthorizedResponse(res);
      }
    } else {
      sendUnAuthorizedResponse(res);
    }
  } catch (error) {
    sendUnAuthorizedResponse(res);
  }
};

export default verifyJWT;
