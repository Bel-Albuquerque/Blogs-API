const categorieService = require('../service/categorieService');
const { tokenNotFound } = require('../validations/errorMessages');

const create = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json(tokenNotFound);

  const { status, json } = await categorieService.create(authorization, req.body);
  return res.status(status).json(json);
};

const getAll = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json(tokenNotFound);
  const { status, json } = await categorieService.getAll(authorization, req.body);
  return res.status(status).json(json);
};

module.exports = {
  create,
  getAll,
};
