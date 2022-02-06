const Sequelize = require('sequelize');
const { User } = require('../models');
require('dotenv').config();

const { 
  erroMessage,
  validateEmptyNotAllowed,
  validateBodyHaveKeys,
} = require('../validations/erroValidations');

const {
  jwtConfig,
  generateToken,
  decoder,
} = require('../validations/tokenValidations');

const arrayCreate = ['displayName', 'email', 'password'];
const arrayFindOne = ['email', 'password'];

const { Op } = Sequelize;

const create = async (body) => {
  try {
    await User.create(body);
    const token = generateToken({ user: body.displayName }, process.env.JWT_SECRET, jwtConfig);
    return { status: 201, json: { token } };
  } catch (err) {
    const erro = validateBodyHaveKeys(body, arrayCreate) || erroMessage(err.errors[0]);
    if (!erro) {
      return { status: 409, json: { message: 'User already registered' } };
    }
    return { status: 400, json: erro };
  }
};

const findOne = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ where: { [Op.and]: [{ password }, { email }] } });
    const token = generateToken({ user: user.displayName }, process.env.JWT_SECRET, jwtConfig);
    return { status: 200, json: { token } };
  } catch (err) {
    const erro = validateEmptyNotAllowed(body, arrayFindOne) || (
      validateBodyHaveKeys(body, arrayFindOne, { message: 'Invalid fields' }));
    return { status: 400, json: erro };
  }
};

const findAll = async () => {
  const users = await User.findAll({
    attributes: { exclude: 'password' },
  });
  return users;
}

const getAll = async (token) => {
  try {
   const userName = await decoder(token);
    await User.findOne({ where: { displayName: userName } });
    const users = await findAll();
    return { status: 200, json: users };
  } catch (e) {
    const json = { message: 'Expired or invalid token' };
    return { status: 401, json };
  }
};

module.exports = {
  create,
  findOne,
  getAll,
};
