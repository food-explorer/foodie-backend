import moment from 'moment';
import httpStatus from 'http-status';
import ApiError from '../utilities/ApiError';
import { User } from '../database/models/user.model';
import { Token } from '../database/models/token.model';
import { tokenService } from '.';



const generateForgotPasswordToken = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return new ApiError(httpStatus.NOT_FOUND, 'Email does not exist');
  }

  const expires = moment().add('60', 'minutes');
  const forgotPasswordToken = tokenService.generateToken({
    userId: user._id,
    type: 'RESET_PASSWORD',
    expires,
  });

  tokenService.saveToken({
    token: forgotPasswordToken,
    expires,
    userId: user.id,
    type: 'RESET_PASSWORD',
  });
  return forgotPasswordToken;
};

const resetPassword = async (newPassword: string, token: string) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(token, 'RESET_PASSWORD');
    const user = await User.findById(resetPasswordTokenDoc.userId);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ userId: user.id, type: 'RESET_PASSWORD' });
    user.setPassword(newPassword);
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password reset failed');
  }
};

export { generateForgotPasswordToken, resetPassword };
