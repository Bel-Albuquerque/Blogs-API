const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');

router
.route('/user')
.post(userController.create)
.get(userController.getAll);

module.exports = router; 