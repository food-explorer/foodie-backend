import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { JWT_SECRET } from '../utilities/secrets';
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

export { saveToken, generateToken, verifyToken }