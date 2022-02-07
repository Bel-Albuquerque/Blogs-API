const express = require('express');
const categorieController = require('../controller/categorieController');

const router = express.Router();

router
  .route('/categories')
  .post(categorieController.create);

module.exports = router; 