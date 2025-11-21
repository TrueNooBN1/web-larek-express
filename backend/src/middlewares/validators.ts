import Joi from 'joi';

export type TOrder = {
    payment: 'card' | 'online';
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export const orderSchema = Joi.object({
  payment: Joi.string()
    .valid('card', 'online')
    .required()
    .messages({
      'any.only': 'incorrect payment method(card or online)',
      'any.required': 'payment required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'any.required': 'email required',
    }),

  phone: Joi.string()
    .required()
    .messages({
      'any.required': 'phone required',
    }),

  address: Joi.string()
    .required()
    .messages({
      'any.required': 'address required',
    }),

  total: Joi.number()
    .required()
    .messages({
      'any.required': 'total required',
    }),

  items: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'any.required': 'items required',
      'array.min': 'empty items array',
      'array.base': 'Items isn`t array',
    }),
});

export const validateOrder = (order : TOrder) => {
  const { error, value } = orderSchema.validate(order);
  if (error) { throw new Error(`Validation error': ${error.message}`); }
  return value;
};
