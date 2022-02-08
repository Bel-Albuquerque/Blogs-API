const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtConfig = {
  algorithm: 'HS256',
};

const generateToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, jwtConfig);
  return token;
};

const decoder = async (token) => {
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  return decoded.user;
};

module.exports = {
  jwtConfig,
  generateToken,
  decoder,
};
