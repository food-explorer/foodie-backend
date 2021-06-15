import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import IUserModel, { User } from '../database/models/user.model';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';
import { authService } from '../service';
import catchAsync from '../utilities/catchAsync';
import {
  sendResetPasswordEmail,
  sendSuccessfulPasswordResetEmail,
} from '../service/email.service';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENTID } from '../utilities/secrets';

const client = new OAuth2Client(
  '209004910483-n4m0ksth3jghbudtq9kleb1uhh5i9u9o.apps.googleusercontent.com'
);

// ISSUE: How does this work with the trailing (req, res, next)?
const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({ status: true, data: user.toAuthJSON() });
    } else {
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        'Invalid username or password'
      );
    }
  })(req, res, next);
};

const register = catchAsync(async (req: Request, res: Response) => {
  const user: IUserModel = new User();

  const { username, email, password, firstName, lastName } = req.body;

  user.username = username;
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;

  user.setPassword(password);
  user.bio = '';
  user.image = '';
  user.header = '';
  await user.save();
  return res.json({ status: true, data: user.toAuthJSON() });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const token = await authService.generateForgotPasswordToken(email);
  const { username } = await User.findOne({ email });
  sendResetPasswordEmail(email, {
    name: username,
    link: `https://foodie.com/reset-password?token=${token}`,
  });
  return res.json({
    status: true,
    message: 'Please check your email address for reset password link',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.resetPassword(
    req.body.newPassword,
    req.query.clay as string
  );

  sendSuccessfulPasswordResetEmail(user.email);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Password reset successfully',
  });
});

// TODO: Come back to get rid of firstname and lastname. use just name
const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.token,
    audience: GOOGLE_CLIENTID,
  });
  const { email, name, picture } = ticket.getPayload();
  const userData = await User.findOneAndUpdate(
    { email },
    { firstName: name, lastName: name, image: picture },
    { upsert: true, new: true }
  );

  res.status(httpStatus.OK).send({
    status: true,
    data: {...userData.toAuthJSON(), name: userData.firstName},
  });
});
export { login, register, forgotPassword, resetPassword, googleAuth };
