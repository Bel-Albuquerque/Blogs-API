const express = require('express');

const router = express.Router();
const postController = require('../controller/postController');

router
.route('/post')
.post(postController.createPost)
.get(postController.getAllPosts);

router
.route('/post/search')
.get(postController.searchTerm);

router
.route('/post/:id')
.get(postController.getPostById)
.put(postController.updatePost)
.delete(postController.deletePost);

module.exports = router; 