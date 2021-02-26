import * as dotenv from "dotenv";
import * as _ from "lodash";
import * as path from "path";

dotenv.config({path: ".env"});

export const ENVIRONMENT    = _.defaultTo(process.env.APP_ENV, "dev");
export const IS_PRODUCTION  = ENVIRONMENT === "production";
export const APP_PORT       = _.defaultTo(parseInt(process.env.APP_PORT), 3000);
export const LOG_DIRECTORY  = _.defaultTo(process.env.LOG_DIRECTORY, path.resolve('logs'));
export const JWT_SECRET     = _.defaultTo(process.env.JWT_SECRET, "secret");
export const DB             = {
  USER    : _.defaultTo(process.env.DB_USER, ""),
  PASSWORD: _.defaultTo(process.env.DB_USER_PWD, ""),
  HOST    : _.defaultTo(process.env.DB_HOST, "localhost"),
  NAME    : _.defaultTo(process.env.DB_NAME, "conduit"),
  PORT    : _.defaultTo(parseInt(process.env.DB_PORT), 27017),
  CONNECTION_STRING  : process.env.MONGODB_URL
}
