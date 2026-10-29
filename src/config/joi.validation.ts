import Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.string().required(),
  DBNAME: Joi.string().required(),
  PORT: Joi.number().default(3001),
  DEFAULT_LIMIT: Joi.number().default(5),
});
