import { Router } from 'express';
import { userValidation } from '../validations';
import validate from '../middlewares/validate';
import { authController } from '../controllers';

const router: Router = Router();

/**
 * POST /api/auth/login
 */
router.post('/login', validate(userValidation.login), authController.login);

/**
 * POST /api/aut/register
 */
router.post(
  '/register',
  validate(userValidation.register),
  authController.register
);

/**
 * POST /api/aut/forgot-password
 */
router.post(
  '/forgot-password',
  validate(userValidation.forgotPassword),
  authController.forgotPassword
);

/**
 * POST /api/auth/reset-password
 */
 router.post(
  '/reset-password',
  validate(userValidation.resetPassword),
  authController.resetPassword
);

export const AuthRoutes = router;
