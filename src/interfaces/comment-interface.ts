import User from '../database/models/user.model';
import PostModel from '../database/models/post.model';

export interface IComment {
  body: string;
  author: User;
  post: PostModel;
}
