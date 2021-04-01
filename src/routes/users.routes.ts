import { NextFunction, Request, Response, Router } from 'express';
import IUserModel, { User } from '../database/models/user.model';
import { authentication, jwtAuthenticate } from '../utilities/authentication';
import {
  viewUser,
  followUser,
  unfollowUser,
  getProfile,
  updateProfile,
} from '../controllers/user.controller';
import validate from '../middlewares/validate';
import { userValidation } from '../validations';

const router: Router = Router();

/**
 * GET /api/user
 */
router.get('/user', jwtAuthenticate, getProfile);

/**
 * PUT /api/user
 */
router.put(
  '/user',
  validate(userValidation.updateUser),
  jwtAuthenticate,
  updateProfile
);

router.get('/user/:username', jwtAuthenticate, viewUser);
router.post('/user/:username/follow', jwtAuthenticate, followUser);
router.post('/user/:username/unfollow', jwtAuthenticate, unfollowUser);

export const UsersRoutes: Router = router;
