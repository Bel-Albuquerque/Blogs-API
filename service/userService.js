const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

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

const message = (key) => ({ message: `"${key}" is required` });

const validaBody = (body) => {
  const array = ['displayName', 'email', 'password'];
  const retorno = array.reduce((acc, cur) => {
    if (!body[cur] && acc.length < 1) return message(cur);
    return acc;
  }, []);
  return retorno.length < 1 ? false : retorno;
};

const create = async (body) => {
  try {
    await User.create(body);
    const token = generateToken({ user: body.displayName }, process.env.JWT_SECRET, jwtConfig);

    return { status: 201, json: { token } };
  } catch (err) {
    const erro = validaBody(body) || erroMessage(err.errors[0]);

    if (!erro) {
      return { status: 409, json: { message: 'User already registered' } };
    }
    return { status: 400, json: erro };
  }
};

module.exports = {
  create,
};
