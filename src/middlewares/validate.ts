import { pick } from '../utilities/pick';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../utilities/ApiError';
import Joi from 'joi';
import httpStatus from 'http-status';

interface SchemaObject {
  body: Joi.ObjectSchema;
}


const validate = (schema: SchemaObject) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
