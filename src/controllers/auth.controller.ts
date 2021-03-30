import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import IUserModel, { User } from '../database/models/user.model';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';
import { authService } from '../service';
import catchAsync from '../utilities/catchAsync';
import { sendResetPasswordEmail, sendSuccessfulPasswordResetEmail } from '../service/email.service';

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
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        'Invalid username or password'
      );
    }
  })(req, res, next);
};

const register = catchAsync(
  async (req: Request, res: Response) => {
    const user: IUserModel = new User();

    const { username, email, password, firstName, lastName } = req.body;

    user.username = username;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;

    user.setPassword(password);
    user.bio = '';
    user.image = '';
    await user.save();
    return res.json({ status: true, data: user.toAuthJSON() });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const token = await authService.generateForgotPasswordToken(email);
    const { username } = await User.findOne({ email });
    sendResetPasswordEmail(email, { name: username, link: `https://foodie.com/reset-password?token=${token}`});
    return res.json({
      status: true,
      message: 'Please check your email address for reset password link',
    });
  }
);

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

export { login, register, forgotPassword, resetPassword };
