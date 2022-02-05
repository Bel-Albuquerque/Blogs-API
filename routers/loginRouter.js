const express = require('express');

const router = express.Router();
const loginController = require('../controller/loginController');

router
.route('/login')
.post(loginController.login);

module.exports = router; 