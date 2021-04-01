import { NextFunction, Request, Response, Router } from 'express';
import IUserModel, { User } from '../database/models/user.model';
import { authentication, jwtAuthenticate } from '../utilities/authentication';
import { viewUser, followUser, unfollowUser } from '../controllers/user.controller';

const router: Router = Router();

/**
 * GET /api/user
 */
router.get(
  '/user',
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.payload.id)
      .then((user: IUserModel) => {
        res.status(200).json({ user: user.toAuthJSON() });
      })
      .catch(next);
  }
);

/**
 * PUT /api/user
 */
router.put(
  '/user',
  authentication.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.payload.id)
      .then((user: IUserModel) => {
        if (!user) {
          return res.sendStatus(401);
        }

        // Update only fields that have values:
        // ISSUE: DRY out code?
        if (typeof req.body.user.email !== 'undefined') {
          user.email = req.body.user.email;
        }
        if (typeof req.body.user.username !== 'undefined') {
          user.username = req.body.user.username;
        }
        if (typeof req.body.user.password !== 'undefined') {
          user.setPassword(req.body.user.password);
        }
        if (typeof req.body.user.image !== 'undefined') {
          user.image = req.body.user.image;
        }
        if (typeof req.body.user.bio !== 'undefined') {
          user.bio = req.body.user.bio;
        }

        return user.save().then(() => {
          return res.json({ user: user.toAuthJSON() });
        });
      })
      .catch(next);
  }
);

router.get('/user/:username', jwtAuthenticate, viewUser);
router.post('/user/:username/follow', jwtAuthenticate, followUser);
router.post('/user/:username/unfollow', jwtAuthenticate, unfollowUser);


export const UsersRoutes: Router = router;
