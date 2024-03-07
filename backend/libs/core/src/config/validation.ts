import * as Joi from 'joi';

// https://docs.nestjs.com/techniques/configuration#schema-validation
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'sync')
    .required(),
  PORT: Joi.number().default(3000)
});
