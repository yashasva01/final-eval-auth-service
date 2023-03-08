const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();

router.post('/users/register', controller.registerNewUsers);

router.post('/users/login', controller.loginUsers);

router.post('/users/validate', controller.validateToken);

module.export = router;