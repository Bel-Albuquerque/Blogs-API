const Sequelize = require('sequelize');
const { User } = require('../models');

const {
  createUserError,
  loginError,
  successRequest,
  erroRequest,
} = require('../validations/errorValidations');

const {
  userInexist,
  expiredToken,
  notFound,
} = require('../validations/errorMessages');

const {
  generateToken,
  decoder,
} = require('../validations/tokenValidations');

const { Op } = Sequelize;

const create = async (body) => {
  try {
    const user = await User.create(body);
    const token = generateToken({ user });
    return { status: 201, json: { token } };
  } catch (err) {
    return createUserError(body, err);
  }
};

const login = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ where: { [Op.and]: [{ password }, { email }] } });
    const token = generateToken({ user });
    return { status: 200, json: { token } };
  } catch (err) {
      return loginError(body);
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

// Coruja aconselhou deichar as funções mais legíveis, por isso, separei em duas.

// const getOneOrAllUsers = async (token, callback, id = false) => {
//   try {
//     const { displayName } = await decoder(token);
//     await User.findOne({ where: { displayName } });
//     const users = id ? await callback(id) : await callback();

//     return !users ? erroRequest(404, userInexist) : successRequest(200, users);
//   } catch (e) {
//     return erroRequest(401, expiredToken);
//   }
// };

const getUserById = async (token, id) => {
  try {
    const { displayName } = await decoder(token);
    await User.findOne({ where: { displayName } });
    const users = await findUser(id);

    return !users ? erroRequest(404, userInexist) : successRequest(200, users);
  } catch (e) {
    return erroRequest(401, expiredToken);
  }
};

const getAllUsers = async (token) => {
  try {
    const { displayName } = await decoder(token);
    await User.findOne({ where: { displayName } });
    const users = await findAll();

    return !users ? erroRequest(404, userInexist) : successRequest(200, users);
  } catch (e) {
    return erroRequest(401, expiredToken);
  }
};

module.exports = {
  create,
  login,
  // getOneOrAllUsers,
  findAll,
  findUser,
  getUserById,
  getAllUsers,
};
