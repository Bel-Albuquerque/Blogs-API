const jwt = require('jsonwebtoken');
const { User } = require('../models');

const topSecret = 'seusecretdetoken';

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

const create = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;
    await User.create({ displayName, email, password, image });
    const token = generateToken({ user: displayName }, topSecret, jwtConfig);
    return res.status(201).json({ token });
  } catch (err) {
    const erro = validaBody(req.body) || erroMessage(err.errors[0]);
    // console.log(err.errors[0]);
    if (err.errors && err.errors[0].path === 'Users.email') {
      return res.status(409).json({ message: 'User already registered' });
    }
    return res.status(400).json(erro);
  }
};

module.exports = {
  create,
};
