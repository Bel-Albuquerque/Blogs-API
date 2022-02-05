const userService = require('../service/userService');

const create = async (req, res) => {
  const { status, json } = await userService.create(req.body);
  return res.status(status).json(json);
};

const getAll = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token not found' });
  const response = await userService.getAll(authorization);
  return res.status(response.status).json(response.json);
};

module.exports = {
  create,
  getAll,
};
