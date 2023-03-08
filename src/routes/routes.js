const express = require('express');
const controller = require('../controller/controller');
const { Schemas, validate } = require('../middleware/auth.validator');
const router = express.Router();

router.post('/users/register', validate(Schemas.registerSchema, 'body'), controller.registerNewUsers);

router.post('/users/login', validate(Schemas.loginSchema, 'body'), controller.loginUsers);

router.post('/users/validate', validate(Schemas.tokenHeaderSchema, 'headers'), controller.validateToken);

module.exports = router;