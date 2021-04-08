import { Document, Model, model, Schema, Types } from 'mongoose';
import IUserModel, { User } from './user.model';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import slugify from 'slugify';
import { IPost } from '../../interfaces/post.interface';

export default interface PostModel extends IPost, Document {
  toJSONFor(user: IUserModel): any;

  slugify(): string;

  updateFavoriteCount(): Promise<PostModel>;
}

const PostSchema = new Schema<PostModel>(
  {
    slug: {
      type: Schema.Types.String,
      lowercase: true,
      unique: true,
    },
    title: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
    images: [
      {
        typs: Schema.Types.String,
      }
    ],
    accessibilityList: [
      {
        type: Schema.Types.String,
      }
    ],
    tagList: [
      {
        type: Schema.Types.String,
      },
    ],
    favoritesCount: {
      type: Schema.Types.Number,
      default: 0,
    },
    visitsCount: {
      type: Schema.Types.Number,
      default: 0
    },
    averageRating: {
      type: Schema.Types.Number,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      name: {
        type: Schema.Types.String,
      },
      lat: {
        type: Schema.Types.Number
      },
      long: {
        type: Schema.Types.Number
      }
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.slugify = function () {
  this.slug =
    slugify(this.title) +
    '-' +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

PostSchema.plugin(mongooseUniqueValidator, { message: 'is already taken' });

PostSchema.pre<PostModel>('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});

PostSchema.methods.updateFavoriteCount = function () {
  const post = this;
  return User.count({ favorites: { $in: [post._id] } }).then(function (
    count
  ) {
    post.favoritesCount = count;
    return post.save();
  });
};

PostSchema.methods.toJSONFor = function (user: IUserModel) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    accessibilityList: this.accessibilityList,
    visitsCount: this.visitsCount,
    location: this.location,
    averageRating: this.averageRating,
    images: this.images,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user),
  };
};

export const Post: Model<PostModel> = model<PostModel>(
  'Post',
  PostSchema
);
