const jwt = require('jsonwebtoken');

const jwtConfig = {
  algorithm: 'HS256',
};

const generateToken = (data, secret, config) => {
  const token = jwt.sign(data, secret, config);
  return token;
};

const decoder = async (token) => {
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  return decoded.user;
};

module.exports = {
  jwtConfig,
  generateToken,
  decoder,
};
