import { Document, Model, model, Schema, Types } from 'mongoose';
import { IUser } from '../../interfaces/user-interface';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import dayjs from 'dayjs';
import { JWT_SECRET } from '../../utilities/secrets';
import mongooseUniqueValidator = require('mongoose-unique-validator');
import { ObjectID, ObjectId } from 'mongodb';

export default interface IUserModel extends IUser, Document {
  token?: string;
  favorites: [ObjectID];
  following: [ObjectID];

  generateJWT(): string;
  toAuthJSON(): any;
  setPassword(password: string): void;
  validPassword(password: string): boolean;
  toProfileJSONFor(user: IUserModel): any;
  isFollowing(id: string): boolean;
  follow(id: string): Promise<IUser>;
  unfollow(id: string): Promise<IUser>;
  favorite(id: ObjectId): Promise<IUser>;
  unfavorite(id: ObjectId): Promise<IUser>;
  isFavorite(id: string): boolean;

  salt: string;
  hash: string;
}

// ISSUE: Own every parameter and any missing dependencies
const UserSchema = new Schema<IUserModel>(
  {
    username: {
      type: Schema.Types.String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },
    name: {
      type: Schema.Types.String,
      required: [true, "can't be blank"],
    },
    email: {
      type: Schema.Types.String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    bio: {
      type: Schema.Types.String,
    },
    image: {
      type: Schema.Types.String,
    },
    header: {
      type: Schema.Types.String,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    hash: {
      type: Schema.Types.String,
    },
    salt: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(mongooseUniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function (this, password: string): boolean {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
  .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
  .toString('hex');
};

UserSchema.methods.generateJWT = function (): string {
  const exp = dayjs().add(2, 'days').valueOf();
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: exp,
    },
    JWT_SECRET
  );
};

UserSchema.methods.toAuthJSON = function (): any {
  return {
    username: this.username,
    email: this.email,
    name: this.name,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image,
  };
};

UserSchema.methods.toProfileJSONFor = function () {
  return {
    username: this.username,
    name: this.name,
    bio: this.bio,
    header: this.header,
    image:
      this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    following: this ? this.isFollowing(this._id) : false,
  };
};

UserSchema.methods.favorite = function (id: ObjectId) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }

  return this.save();
};

UserSchema.methods.unfavorite = function (id: ObjectId) {
  console.log('🚀 ~ file: user.model.ts ~ line 152 ~ res', id)
  const res = this.favorites.filter((item) => item !== id);
  this.favorites.forEach(item => console.log(item));
  return this.save();
};

UserSchema.methods.isFavorite = function (id: string) {
  return this.favorites.some(function (favoriteId) {
    return favoriteId.toString() === id.toString();
  });
};

UserSchema.methods.follow = function (id: string) {
  const convertedId = new ObjectID(id);
  if (this.following.indexOf(convertedId) === -1) {
    this.following.push(convertedId);
  }
  return this.save();
};

UserSchema.methods.unfollow = function (id: string) {
  const convertedId = new ObjectID(id);
  this.favorites.filter((item) => item !== convertedId);
  return this.save();
};

UserSchema.methods.isFollowing = function (id: string) {
  return this.following.some(function (followId) {
    return followId.toString() === id.toString();
  });
};

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
