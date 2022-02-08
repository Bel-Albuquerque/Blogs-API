const atLast = (bool) => (bool ? ' at least ' : ' ');

const fieldIsRequired = (key) => ({ message: `"${key}" is required` });

const fieldEmptyIsNotAllowed = (key) => ({ message: `"${key}" is not allowed to be empty` });

const fieldLengthRequired = (key, length, bool = false) => (
  { message: `"${key}" length must be${atLast(bool)}${length} characters long` });

const userInexist = { message: 'User does not exist' };
const expiredToken = { message: 'Expired or invalid token' };
const userAlreadyExist = { message: 'User already registered' };
const invalidFields = { message: 'Invalid fields' };
const notFound = { message: 'Not found' };
const emailMustBeValid = { message: '"email" must be a valid email' };
const tokenNotFound = { message: 'Token not found' };

module.exports = {
  fieldIsRequired,
  fieldEmptyIsNotAllowed,
  fieldLengthRequired,
  userInexist,
  expiredToken,
  userAlreadyExist,
  invalidFields,
  notFound,
  emailMustBeValid,
  tokenNotFound,
};
