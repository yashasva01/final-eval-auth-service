const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(30).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(30).required(),
});

const tokenHeaderSchema = Joi.object({
  authorization: Joi.string().required(),
})
  .required()
  .min(1);

const validate = (schema, data) => (req, res, next) => {
  if (req.headers['x-access-token']) {
    const object = { authorization: req.headers['x-access-token'] };

    const { error } = schema.validate(object);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  } else {
    const { error } = schema.validate(req[data]);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  }
};

const Schemas = { registerSchema, loginSchema, tokenHeaderSchema };
module.exports = { Schemas, validate };