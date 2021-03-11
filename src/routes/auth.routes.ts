import { Router } from 'express';
import { userValidation } from '../validations';
import validate from '../middlewares/validate';
import { authController } from '../controllers';

const router: Router = Router();

/**
 * POST /api/users/login
 */
router.post('/login', validate(userValidation.login), authController.login);

/**
 * POST /api/users
 */
router.post('/register', validate(userValidation.register), authController.register);

export const AuthRoutes = router;
