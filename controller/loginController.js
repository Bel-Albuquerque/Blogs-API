const userService = require('../service/userService');

const login = async (req, res) => {
  const { status, json } = await userService.findOne(req.body);
  return res.status(status).json(json);
};

module.exports = {
  login,
};
