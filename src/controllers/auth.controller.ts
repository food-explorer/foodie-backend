import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';


// ISSUE: How does this work with the trailing (req, res, next)?
const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ status: true, data: user.toAuthJSON() });
    } else {
      return new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        'User does not exist'
      );
    }
  })(req, res, next);
};

export { login };
