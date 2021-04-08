import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { postService } from '../service';
import catchAsync from '../utilities/catchAsync';

const fetchAll = catchAsync(async (req: Request, res: Response) => {
  const query: any = {};
  const limit = (req.query.limit as string) || '20';

  if (typeof req.query.tag !== 'undefined') {
    query.tagList = { $in: [req.query.tag] };
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

export { fetchAll, createPost };




