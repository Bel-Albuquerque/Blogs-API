const {
  userAlreadyExist,
  invalidFields,
  emailMustBeValid,
  fieldIsRequired,
  fieldEmptyIsNotAllowed,
  fieldLengthRequired,
  expiredToken,
} = require('./errorMessages');

const arrayCreate = ['displayName', 'email', 'password'];
const arrayLogin = ['email', 'password'];
const arrayEditPost = ['title', 'content'];

const successRequest = (number, message) => ({ status: number, json: message });
const erroRequest = (number, message) => ({ status: number, json: message });

const validatesFieldsContent = (e) => {
  if (e.path === 'displayName') return fieldLengthRequired('displayName', 8, true);
  if (e.path === 'email') return emailMustBeValid;
  if (e.path === 'password') return fieldLengthRequired('password', 6);
};

const validateEmptyNotAllowed = (body, array, message = false) => {
  const retorno = array.reduce((acc, cur) => {
    if (body[cur] === '' && acc.length < 1) {
      return fieldEmptyIsNotAllowed(cur);
    }
    return acc;
  }, []);
  return retorno.length < 1 ? message : retorno;
};

const validateBodyHaveKeys = (body, array, message = false) => {
  const retorno = array.reduce((acc, cur) => {
    if (!body[cur] && acc.length < 1) return fieldIsRequired(cur);
    return acc;
  }, []);
  return retorno.length < 1 ? message : retorno;
};

// __________________________________________________________________

const createUserError = (body, error) => {
  const erro = validateBodyHaveKeys(body, arrayCreate) || validatesFieldsContent(error.errors[0]);
  if (!erro) {
    return erroRequest(409, userAlreadyExist);
  }
  return erroRequest(400, erro);
};

const loginError = (body) => {
  const erro = validateEmptyNotAllowed(body, arrayLogin) || (
    validateBodyHaveKeys(body, arrayLogin)) || invalidFields;
  return erroRequest(400, erro);
};

const createCategorieError = (body) => {
  const nameIsFalse = validateBodyHaveKeys(body, ['name']);
  if (nameIsFalse) {
    return erroRequest(400, nameIsFalse);
  }
  return erroRequest(401, expiredToken);
};

const postEditError = (body) => {
  const bodyRequiredIsFalse = validateBodyHaveKeys(body, arrayEditPost);
  if (bodyRequiredIsFalse) return erroRequest(400, bodyRequiredIsFalse);
  if (body.categoryIds) return erroRequest(400, { message: 'Categories cannot be edited' });
  return false;
};

module.exports = {
  createUserError,
  loginError,
  successRequest,
  erroRequest,
  validateBodyHaveKeys,
  createCategorieError,
  postEditError,
};
