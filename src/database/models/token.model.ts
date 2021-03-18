import { Document, Schema, model, Model } from 'mongoose';
import { Moment } from 'moment';


export default interface IToken {
  token: string;
  type: 'RESET_PASSWORD' | 'AUTH';
  expires: Moment;
  userId: string;
  blacklisted?: boolean;
}

interface ITokenModel extends IToken, Document {}

const tokenSchema = new Schema({
  token: {
    type: Schema.Types.String,
    required: [true, "can't be blank"],
  },
  type: {
    type: Schema.Types.String,
    required: [true, "can't be blank"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "can't be blank"],
    ref: 'User',
  },
  expires: {
    type: Schema.Types.String,
    required: [true, "can't be blank"],
  },
  blacklisted: {
    type: Schema.Types.Boolean,
    default: false,
  }
});


export const Token: Model<ITokenModel> = model<ITokenModel>('Token', tokenSchema);
