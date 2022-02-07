const { Categorie, User } = require('../models');
const { successRequest, createCategorieErrorCases } = require('../validations/errorValidations');
const { decoder } = require('../validations/tokenValidations');

const create = async (token, body) => {
  try {
    const userName = await decoder(token);
    await User.findOne({ where: { displayName: userName } });

    const categorie = await Categorie.create(body);
    return successRequest(201, categorie);
  } catch (err) {
    console.log(err);
    return createCategorieErrorCases(body);
  }
};

module.exports = {
  create,
};
