import { Request, Response, Router } from 'express';
import { postController } from '../controllers';
import validate from '../middlewares/validate';
import { postValidation } from '../validations';
import { jwtAuthenticate } from '../utilities/authentication';

const router: Router = Router();

router.get('/', postController.fetchAll);
router.post(
  '/',
  jwtAuthenticate,
  validate(postValidation.createPost),
  postController.createPost
);

export const PostRoutes = router;
