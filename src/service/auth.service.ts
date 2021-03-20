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

type TokenPayload = {
  sub: string;
  iat: number;
  exp: number;
  type: 'RESET_PASSWORD' | 'AUTH';
};

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

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: 'RESET_PASSWORD' | 'AUTH') => {
  const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
  if (!payload) {
    throw new Error('Invalid Token');
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
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

const resetPassword = async (newPassword: string, token: string) => {
  try {
    const resetPasswordTokenDoc = await verifyToken(token, 'RESET_PASSWORD');
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

export { generateForgotPasswordToken, verifyToken, resetPassword };
