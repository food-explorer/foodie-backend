import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { JWT_SECRET } from '../utilities/secrets';
import httpStatus from 'http-status';
import ApiError from '../utilities/ApiError';
import { User } from '../database/models/user.model';
import IToken, { Token } from '../database/models/token.model';

interface GenerateTokenProps {
  userId: string;
  expires: Moment;
  type: 'RESET_PASSWORD' | 'AUTH';
  secret?: string;
}

const generateToken = (data: GenerateTokenProps) => {
  const { userId, expires, type, secret = JWT_SECRET } = data;

  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (data: IToken) => {
  const { token, userId, type, blacklisted, expires } = data;
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const generateForgotPasswordToken = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return new ApiError(httpStatus.NOT_FOUND, 'Email does not exist');
  }

  const expires = moment().add('60', 'minutes');
  const forgotPasswordToken = generateToken({
    userId: user._id,
    type: 'RESET_PASSWORD',
    expires,
  });

  saveToken({
    token: forgotPasswordToken,
    expires,
    userId: user.id,
    type: 'RESET_PASSWORD',
  });
  return forgotPasswordToken;
};

export { generateForgotPasswordToken };
