import { Request, Response } from 'express';
import catchAsync from '../utilities/catchAsync';
import { userService } from '../service';
import httpStatus from 'http-status';

const viewUser = catchAsync(async (req: Request, res: Response) => {
  const username = req.params.username;
  const data = await userService.viewUser(username, req.profile);

  res.status(httpStatus.OK).send({
    status: true,
    data,
  });
});


const followUser = catchAsync(async (req: Request, res: Response) => {
  const username = req.params.username;
  await userService.followUser(username, req.profile);

  res.status(httpStatus.OK).send({
    status: true,
    message: 'User followed successfully',
  });
});

const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const username = req.params.username;
  await userService.unfollowUser(username, req.profile);

  res.status(httpStatus.OK).send({
    status: true,
    message: 'User unfollowed successfully',
  });
});

export { viewUser, followUser, unfollowUser };
