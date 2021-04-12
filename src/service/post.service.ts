import { Post } from '../database/models/post.model';
import IUserModel from '../database/models/user.model';

const fetchAll = async (query: {}, limit: string) => {
  const posts = await Post.find(query)
    .limit(Number(limit))
    .sort('createdAt')
    .populate('author', ['username', 'firstName', 'lastName'])
    .exec();

  return posts;
};

const createPost = async (body: any, user: IUserModel) => {
  const post = new Post(body);

  post.author = user;
  await post.save();

  return post.toJSONFor(user);
};

export { fetchAll, createPost };
