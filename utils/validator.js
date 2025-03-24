const Joi = require('joi');

const validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validateEditedUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6),
  });

  return schema.validate(data);
};

const validateTask = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(150).required(),
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string().length(24).optional().allow(null, ''), // Optional MongoDB ObjectId
    deadline: Joi.alternatives()
      .try(Joi.date(), Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .optional(), // Allows "YYYY-MM-DD" or Date object
    status: Joi.string()
      .valid('pending', 'in-progress', 'completed')
      .default('pending'),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  });

  return schema.validate(data);
};

const validateEditedTask = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(150).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    category: Joi.string().length(24).optional().allow(null, ''),
    deadline: Joi.alternatives()
      .try(Joi.date().iso(), Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .optional(),
    status: Joi.string()
      .valid('pending', 'in-progress', 'completed')
      .optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
  });

  return schema.validate(data);
};

module.exports = {
  validateRegistration,
  validateEditedUser,
  validateLogin,
  validateTask,
  validateEditedTask,
};
