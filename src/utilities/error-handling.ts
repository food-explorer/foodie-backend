import { Application, Request, Response } from 'express';
import { IS_PRODUCTION } from './secrets';
import logger from './logger';
import mongoose from 'mongoose';
import ApiError from './ApiError';
import httpStatus from 'http-status';

export function loadErrorHandlers(app: Application) {
  // catch 404 errors and forward to error handler
  app.use((req, res, next) => {
    const fourOhFourError = new ApiError(
      httpStatus.NOT_FOUND,
      'Route does not exist'
    );
    next(fourOhFourError);
  });

  app.use((err: any, req: Request, res: Response, next: any) => {
    let error = err;
    if (!(error instanceof ApiError)) {
      const statusCode =
        error.statusCode || error instanceof mongoose.Error
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
  });

  app.use((err: any, req: Request, res: Response, next: any) => {
    const { statusCode, message } = err;
    const response = {
      status: false,
      message: message,
    };

    logger.error(err);
    res.status(statusCode).send(response);
  });
}
