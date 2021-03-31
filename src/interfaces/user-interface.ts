import User from '../database/models/user.model';

export interface IUser {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  firstName: string;
  lastName: string;
  header?: string;
  // following: User[];
}

export interface IProfile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}


export type ITokenPayload = {
  id: string;
  username: string;
  exp: number;
  iat: number
};