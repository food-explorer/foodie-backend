import { Request, Response, Router } from 'express';
import { postController } from '../controllers';
import validate from '../middlewares/validate';
import { postValidation } from '../validations';
import { jwtAuthenticate } from '../utilities/authentication';
import { Post } from '../database/models/post.model';
import httpStatus from 'http-status';
import { fetchPost } from '../controllers/post.controller';

const router: Router = Router();

// Preload post objects on routes with ':post'
router.param('post', async (req: Request, res: Response, next, slug) => {
  const post = await Post.findOne({ slug }).populate('author');

  if (!post) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ status: false, message: 'Post not found' });
  }

  req.post = post;
  next();
});

router.get('/', postController.fetchAll);
router.get('/:post', jwtAuthenticate, fetchPost);
router.post(
  '/',
  jwtAuthenticate,
  validate(postValidation.createPost),
  postController.createPost
);

export const PostRoutes = router;
