const { Categorie, User } = require('../models');
const { expiredToken } = require('../validations/errorMessages');
const {
  successRequest,
  createCategorieError,
  erroRequest,
} = require('../validations/errorValidations');
const { decoder } = require('../validations/tokenValidations');

const create = async (token, body) => {
  try {
    const { displayName } = await decoder(token);
    await User.findOne({ where: { displayName } });

    const categorie = await Categorie.create(body);
    return successRequest(201, categorie);
  } catch (err) {
    return createCategorieError(body);
  }
};

const getAll = async (token) => {
  try {
    const { displayName } = await decoder(token);
    await User.findOne({ where: { displayName } });

    const categorie = await Categorie.findAll();
    return successRequest(200, categorie);
  } catch (err) {
    return erroRequest(401, expiredToken);
  }
};

module.exports = {
  create,
  getAll,
};
