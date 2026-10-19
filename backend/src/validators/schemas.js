import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().max(100).required(),
  password: Joi.string().min(6).max(30).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(100).required(),
  password: Joi.string().required(),
});

export const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().max(2147483647).required(),
        quantity: Joi.number().integer().min(1).max(20).required(),
      }),
    )
    .min(1)
    .required(),
});
