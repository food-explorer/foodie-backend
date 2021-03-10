import { NextFunction, Request, Response, Router } from 'express';
import IUserModel, { User } from '../database/models/user.model';
import passport from 'passport';
import { userValidation } from '../validations';
import validate from '../middlewares/validate';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';

const router: Router = Router();

// ISSUE: How does this work with the trailing (req, res, next)?
/**
 * POST /api/users/login
 */
router.post(
  '/login',
  validate(userValidation.login),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (user) {
        user.token = user.generateJWT();
        return res.json({ status: true, data: user.toAuthJSON() });
      } else {
        return new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'User does not exist');
      }
    })(req, res, next);
  }
);

export const AuthRoutes = router;
