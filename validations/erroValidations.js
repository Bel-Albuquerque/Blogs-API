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
    if (!body[cur] && acc.length < 1) return messageIsRequired(cur);
    return acc;
  }, []);
  return retorno.length < 1 ? message : retorno;
};

module.exports = {
  erroMessage,
  validateEmptyNotAllowed,
  validateBodyHaveKeys,
};
