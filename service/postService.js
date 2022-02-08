const Sequelize = require('sequelize');
const { User, Categorie, BlogPost, PostsCategorie } = require('../models');

const {
  validateBodyHaveKeys,
  loginError,
  successRequest,
  erroRequest,
} = require('../validations/errorValidations');

const {
  fieldNotFound,
  expiredToken,
} = require('../validations/errorMessages');

const {
  generateToken,
  decoder,
} = require('../validations/tokenValidations');

const arrayCreatePost = ['title', 'categoryIds', 'content'];

const { Op } = Sequelize;

const mapCreatePostsCategories = async (body, postId, userId) => {
  const { title, categoryIds, content } = body;
  try {
    const mapCategories = categoryIds.map(async (categoryId) => (
      PostsCategorie.create({ categoryId, postId })));

    await Promise.all(mapCategories);
    return successRequest(201, { id: postId, userId, title, content });
  } catch (err) {
    return erroRequest(400, fieldNotFound('categoryIds'));
  }
};

const createPost = async (body, token) => {
  const { title, content } = body;
  try {
    const { id: userId } = await decoder(token);
    await User.findOne({ where: { id: userId } });

    const error = validateBodyHaveKeys(body, arrayCreatePost);
    if (error) return erroRequest(400, error);

    const { id } = await BlogPost.create({ title, content, userId });

    return await mapCreatePostsCategories(body, id, userId);
  } catch (err) {
    return erroRequest(401, expiredToken);
  }
};

module.exports = {
  createPost,
};
