import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import * as path from 'path';

dotenv.config({ path: '.env' });

export const ENVIRONMENT = _.defaultTo(process.env.APP_ENV, 'development');
export const IS_PRODUCTION = ENVIRONMENT === 'production';
export const APP_PORT = _.defaultTo(parseInt(process.env.APP_PORT), 3000);
export const LOG_DIRECTORY = _.defaultTo(
  process.env.LOG_DIRECTORY,
  path.resolve('logs')
);
export const JWT_SECRET = _.defaultTo(process.env.JWT_SECRET, 'secret');
export const DB = {
  USER: _.defaultTo(process.env.DB_USER, ''),
  PASSWORD: _.defaultTo(process.env.DB_USER_PWD, ''),
  HOST: _.defaultTo(process.env.DB_HOST, 'localhost'),
  NAME: _.defaultTo(process.env.DB_NAME, 'conduit'),
  PORT: _.defaultTo(parseInt(process.env.DB_PORT), 27017),
  CONNECTION_STRING: process.env.MONGODB_URL,
};


export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
export const EMAIL_FROM = process.env.EMAIL_FROM;
