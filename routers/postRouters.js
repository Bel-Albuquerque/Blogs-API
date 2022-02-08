const express = require('express');

const router = express.Router();
const postController = require('../controller/postController');

router
.route('/post')
.post(postController.createPost);

module.exports = router; 