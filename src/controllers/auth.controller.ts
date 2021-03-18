import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import IUserModel, { User } from '../database/models/user.model';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';
import { generateForgotPasswordToken } from '../service/auth.service';

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

const register = async (req: Request, res: Response, next: NextFunction) => {
  const user: IUserModel = new User();

  const { username, email, password, firstName, lastName } = req.body;

  user.username = username;
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;

  user.setPassword(password);
  user.bio = '';
  user.image = '';

  try {
    await user.save();
    return res.json({ status: true, data: user.toAuthJSON() });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const token = generateForgotPasswordToken(email);
  // send email with token
  return res.json({
    status: true,
    message: 'Please check your email address for reset password link',
  });
};
export { login, register, forgotPassword };
