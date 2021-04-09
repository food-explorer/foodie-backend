import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { postService } from '../service';
import catchAsync from '../utilities/catchAsync';
import { User } from '../database/models/user.model';
import { Post } from '../database/models/post.model';

const fetchAll = catchAsync(async (req: Request, res: Response) => {
  const query: any = {};
  const limit = (req.query.limit as string) || '20';

  if (req.query.tag) {
    query.tagList = { $in: [req.query.tag] };
  }

  if (req.query.author) {
    const author = await User.findOne({ username: req.query.author as string });
    query.author = author._id;
  }

  if (req.query.favorites) {
    const favoriter = await User.findOne({
      username: req.query.favorites as string,
    });
    query._id = { $in: favoriter.favorites };
  }

  const posts = await postService.fetchAll(query, limit);

  res.status(httpStatus.OK).send({
    status: true,
    data: posts,
  });
});

const createPost = catchAsync(async (req: Request, res: Response) => {
  const data = await postService.createPost(req.body, req.profile);
  res.status(httpStatus.OK).send({
    status: true,
    data,
  });
});

const fetchPost = async (req: Request, res: Response) => {
  const data = req.post.toJSONFor(req.profile);

  res.status(httpStatus.OK).send({
    status: true,
    data,
  });
};
export { fetchAll, createPost, fetchPost };
