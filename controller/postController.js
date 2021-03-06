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

const updatePost = async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  if (!authorization) return res.status(401).json(tokenNotFound);

  const { status, json } = await postService.updatePost(id, authorization, req.body);
  return res.status(status).json(json);
};

const deletePost = async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  if (!authorization) return res.status(401).json(tokenNotFound);

  const { status, json } = await postService.deletePost(id, authorization);
  return res.status(status).json(json);
};

const searchTerm = async (req, res) => {
  const { q } = req.query;
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json(tokenNotFound);
  const { status, json } = await postService.searchTerm(q, authorization);

  return res.status(status).json(json);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  searchTerm,
};
