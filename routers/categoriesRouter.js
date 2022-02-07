const express = require('express');
const categorieController = require('../controller/categorieController');

const router = express.Router();

router
  .route('/categories')
  .post(categorieController.create)
  .get(categorieController.getAll);

module.exports = router; 