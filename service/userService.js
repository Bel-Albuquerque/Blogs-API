const Sequelize = require('sequelize');
const { User } = require('../models');
require('dotenv').config();

const {
  createErrorCases,
  loginErrorCases,
  successRequest,
  erroRequest,
} = require('../validations/errorValidations');

const {
  userInexist,
  expiredToken,
  notFound,
} = require('../validations/errorMessages');

const {
  jwtConfig,
  generateToken,
  decoder,
} = require('../validations/tokenValidations');

const { Op } = Sequelize;

const create = async (body) => {
  try {
    await User.create(body);
    const token = generateToken({ user: body.displayName }, process.env.JWT_SECRET, jwtConfig);
    return { status: 201, json: { token } };
  } catch (err) {
    return createErrorCases(body, err);
  }
};

const login = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ where: { [Op.and]: [{ password }, { email }] } });
    const token = generateToken({ user: user.displayName }, process.env.JWT_SECRET, jwtConfig);
    return { status: 200, json: { token } };
  } catch (err) {
      return loginErrorCases(body);
  }
};

const findAll = async () => {
  const users = await User.findAll({
    attributes: { exclude: 'password' },
  });
  return users;
};

const findUser = async (keyProperty) => {
  try {
    const returnUser = await User.findOne(
      {
        where: { id: keyProperty },
        attributes: { exclude: 'password' },
      },
    );
    return returnUser;
  } catch (e) {
    return erroRequest(401, notFound);
  }
};

const getOneOrAllUsers = async (token, callback, id = false) => {
  try {
    const userName = await decoder(token);
    await User.findOne({ where: { displayName: userName } });
    const users = id ? await callback(id) : await callback();

    return !users ? erroRequest(404, userInexist) : successRequest(200, users);
  } catch (e) {
    return erroRequest(401, expiredToken);
  }
};

module.exports = {
  create,
  login,
  getOneOrAllUsers,
  findAll,
  findUser,
};
