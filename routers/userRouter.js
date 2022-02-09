const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');

router
.route('/user/me')
.delete(userController.deleteMe);

router
.route('/user/:id')
.get(userController.getById);

router
.route('/user')
.post(userController.create)
.get(userController.getAll);

module.exports = router; 