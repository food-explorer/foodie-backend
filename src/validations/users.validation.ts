import Joi from 'joi';

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
  query: Joi.object().keys({
    clay: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    newPassword: Joi.string().required(),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    username: Joi.string(),
    location: Joi.string(),
    bio: Joi.string(),
  }),
};

const googleAuth = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export { register, login, forgotPassword, resetPassword, updateUser, googleAuth };
