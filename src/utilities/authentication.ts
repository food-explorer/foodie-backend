import { Request, NextFunction, Response } from 'express';
const jwt = require('express-jwt');
import * as jsonWebTokn from 'jsonwebtoken';
import { JWT_SECRET } from './secrets';
import dayjs from 'dayjs';
import ApiError from './ApiError';
import httpStatus from 'http-status';
import { User } from '../database/models/user.model';
import { ITokenPayload } from '../interfaces/user-interface';

function getTokenFromHeader(req: Request): string | null {
  const headerAuth: string | string[] = req.headers.authorization;

  if (headerAuth !== undefined && headerAuth !== null) {
    if (Array.isArray(headerAuth)) {
      return splitToken(headerAuth[0]);
    } else {
      return splitToken(headerAuth);
    }
  } else {
    return null;
  }
}

function splitToken(authString: string) {
  if (authString.split(' ')[0] === 'Bearer') {
    return authString.split(' ')[1];
  } else {
    return null;
  }
}

const auth = {
  required: jwt({
    credentialsRequired: true,
    secret: JWT_SECRET,
    getToken: getTokenFromHeader,
    userProperty: 'payload',
    // @ts-ignore
    algorithms: ['HS256'],
  }),

  optional: jwt({
    credentialsRequired: false,
    secret: JWT_SECRET,
    getToken: getTokenFromHeader,
    userProperty: 'payload',
    algorithms: ['HS256'],
  }),
};

export const jwtAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromHeader(req);
    const payload = jsonWebTokn.verify(token, JWT_SECRET) as ITokenPayload;
    if (!payload || payload.exp < dayjs().valueOf()) {
      throw new Error('Invalid Token, please sign in again');
    }
    const user = await User.findById(payload.id);
    if (!user) {
      throw new Error('Invalid Token, please sign in again');
    }

    req.profile = user;
    next();
  } catch (error) {
    next(error);
  }
};

// TODO: Is it better to just set this variable to the returned value instead of a function?
const generateRandomNumber = () => Math.floor(Math.random() * 1000);

const generateUsername = (name: string, digit?: number) => {
  let username = name.split(' ').join('').toLowerCase();
  if (digit) {
    username += digit;
  }
  return username;
};

export const generateUniqueUsername = async (name: string, digit?: number): Promise<string> => {
  const generatedUsername = generateUsername(name, digit);
  const usernameExists = await User.findOne({ username: generatedUsername });

  if (usernameExists) {
    const randomNumber = generateRandomNumber();
    return generateUniqueUsername(generatedUsername, randomNumber);
  } else {
    return generatedUsername;
  }
}

export const authentication = auth;
