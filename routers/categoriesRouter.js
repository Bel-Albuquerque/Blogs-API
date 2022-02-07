const express = require('express');
const categorieController = require('../controller/categorieController');

const router = express.Router();

const test = async (req, res) => {
  const {title, constent, userId } = req.body; 
}

router
  .route('/categories')
  // .post(categorieController.create)
  .get(categorieController.getAll);

module.exports = router; 