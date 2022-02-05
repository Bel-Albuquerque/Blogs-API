const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { User } = require('../models');
require('dotenv').config();

const { Op } = Sequelize;

const jwtConfig = {
  algorithm: 'HS256',
};

const generateToken = (data, secret, config) => {
  const token = jwt.sign(data, secret, config);
  return token;
};

const arrayCreate = ['displayName', 'email', 'password'];
const arrayFindOne = ['email', 'password'];
const atLast = (bool) => (bool ? ' at least ' : ' ');

const messageIsRequired = (key) => ({ message: `"${key}" is required` });
const messageEmptyNotAllowed = (key) => ({ message: `"${key}" is not allowed to be empty` });
const messageLengthRequired = (key, length, bool = false) => (
  { message: `"${key}" length must be${atLast(bool)}${length} characters long` });

const erroMessage = (e) => {
  if (e.path === 'displayName') return messageLengthRequired('displayName', 8, true);
  if (e.path === 'email') return { message: '"email" must be a valid email' };
  if (e.path === 'password') return messageLengthRequired('password', 6);
};

const validateEmptyNotAllowed = (body, array, message = false) => {
  const retorno = array.reduce((acc, cur) => {
    if (body[cur] === '' && acc.length < 1) {
      return messageEmptyNotAllowed(cur);
    }
    return acc;
  }, []);
  return retorno.length < 1 ? message : retorno;
};

const validateBodyHaveKeys = (body, array, message = false) => {
  const retorno = array.reduce((acc, cur) => {
    console.log(cur);
    if (!body[cur] && acc.length < 1) return messageIsRequired(cur);
    return acc;
  }, []);
  return retorno.length < 1 ? message : retorno;
};

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
    const status = 200;
    return { status, json: token };
  } catch (err) {
    const erro = validateEmptyNotAllowed(body, arrayFindOne) || (
      validateBodyHaveKeys(body, arrayFindOne, { message: 'Invalid fields' }));
    return { status: 400, json: erro };
  }
};

module.exports = {
  create,
  findOne,
};
