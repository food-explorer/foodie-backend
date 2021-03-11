import { NextFunction, Request, Response, Router } from 'express';
import IUserModel, { User } from '../database/models/user.model';
import passport from 'passport';
import { userValidation } from '../validations';
import validate from '../middlewares/validate';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';
import { authController } from '../controllers';

const router: Router = Router();

/**
 * POST /api/users/login
 */
router.post('/login', validate(userValidation.login), authController.login);

export const AuthRoutes = router;
