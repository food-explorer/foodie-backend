import { Document, model, Model, Schema } from 'mongoose';
import { IComment } from '../../interfaces/comment-interface';
import IUserModel from './user.model';

export default interface ICommentModel extends IComment, Document {
  toJSONFor(user: IUserModel): any;
  createdAt: string;
}

const CommentSchema = new Schema<ICommentModel>(
  {
    body: {
      type: Schema.Types.String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
    },
  },
  { timestamps: true }
);

CommentSchema.methods.toJSONFor = function (user: IUserModel) {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user),
  };
};

export const Comment: Model<ICommentModel> = model<ICommentModel>(
  'Comment',
  CommentSchema
);
