const postService = require('../service/postService');
const { tokenNotFound } = require('../validations/errorMessages');

const createPost = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json(tokenNotFound);
  
  const { status, json } = await postService.createPost(req.body, authorization);
  return res.status(status).json(json);
};

const getAllPosts = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json(tokenNotFound);
  
  const { status, json } = await postService.getAllPosts(authorization);
  return res.status(status).json(json);
};

const getPostById = async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  if (!authorization) return res.status(401).json(tokenNotFound);
  
  const { status, json } = await postService.getPostById(id, authorization);
  return res.status(status).json(json);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
};
