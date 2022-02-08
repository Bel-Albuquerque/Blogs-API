const userService = require('../service/userService');
const { tokenNotFound } = require('../validations/errorMessages');

const create = async (req, res) => {
  const { status, json } = await userService.create(req.body);
  return res.status(status).json(json);
};

const getAll = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json(tokenNotFound);
  const response = await userService.getAllUsers(authorization);
  return res.status(response.status).json(response.json);
};

const getById = async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  if (!authorization) return res.status(401).json(tokenNotFound);
  const response = await userService.getUserById(authorization, id);
  return res.status(response.status).json(response.json);
};

module.exports = {
  create,
  getAll,
  getById,
};
