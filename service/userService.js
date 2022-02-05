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

const erroMessage = (e) => {
  if (e.path === 'displayName') {
    return { message: '"displayName" length must be at least 8 characters long' };
  }
  if (e.path === 'email') return { message: '"email" must be a valid email' };

  if (e.path === 'password') return { message: '"password" length must be 6 characters long' };
};

const messageIsRequired = (key) => ({ message: `"${key}" is required` });
const messageEmptyNotAllowed = (body, arrayFindOne, message = false) => {
  const retorno = arrayFindOne.reduce((acc, cur) => {
    if (!body[cur]) return { message: `"${cur}" is not allowed to be empty` };
    return acc;
  }, []);
  return retorno.length < 1 ? message : retorno;
};

const arrayCreate = ['displayName', 'email', 'password'];
const arrayFindOne = ['email', 'password'];

const validaBody = (body, array) => {
  const retorno = array.reduce((acc, cur) => {
    console.log(cur);
    if (!body[cur] && acc.length < 1) return messageIsRequired(cur);
    return acc;
  }, []);
  console.log(retorno);
  return retorno.length < 1 ? false : retorno;
};

const create = async (body) => {
  try {
    await User.create(body);
    const token = generateToken({ user: body.displayName }, process.env.JWT_SECRET, jwtConfig);

    return { status: 201, json: { token } };
  } catch (err) {
    const erro = validaBody(body, arrayCreate) || erroMessage(err.errors[0]);

    if (!erro) {
      return { status: 409, json: { message: 'User already registered' } };
    }
    return { status: 400, json: erro };
  }
};

const findOne = async (body) => {
  try {
    let erro;
    const { email, password } = body;
    const user = await User.findAll({ where: { [Op.and]: [{ password }, { email }] } });
    if (user.length < 1) {
      erro = messageEmptyNotAllowed(body, arrayFindOne, { message: 'Invalid fields' });
    }
    const token = generateToken({ user: user.displayName }, process.env.JWT_SECRET, jwtConfig);
    const json = erro || token;
    const status = erro ? 400 : 200;
    return { status, json };
  } catch (err) {
    const erro = validaBody(body, arrayFindOne);
    return { status: 400, json: erro };
  }
};

module.exports = {
  create,
  findOne,
};
