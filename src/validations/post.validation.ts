import Joi from 'joi';

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    location: Joi.object().keys({
      name: Joi.string(),
      long: Joi.number(),
      lat: Joi.number(),
    }),
    accessibilityList: Joi.array(),
    tagList: Joi.array(),
    images: Joi.array(),
  }),
};

export { createPost };
