const { User, BlogPost, PostsCategorie, Categorie } = require('../models');

const {
  validateBodyHaveKeys,
  successRequest,
  erroRequest,
} = require('../validations/errorValidations');

const {
  fieldNotFound,
  expiredToken,
  fielfInexist,
} = require('../validations/errorMessages');

const {
  decoder,
} = require('../validations/tokenValidations');

const arrayCreatePost = ['title', 'categoryIds', 'content'];

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
    await User.findOne({ where: { id: userId } }); // valida token

    const error = validateBodyHaveKeys(body, arrayCreatePost);
    if (error) return erroRequest(400, error);

    const { id } = await BlogPost.create({ title, content, userId });
    return await mapCreatePostsCategories(body, id, userId);
  } catch (err) {
    return erroRequest(401, expiredToken);
  }
};

const getAllPosts = async (token) => {
  try {
    const { id: userId } = await decoder(token);
    await User.findOne({ where: { id: userId } });
  
    const allPosts = await BlogPost.findAll(
      {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Categorie, as: 'categories', through: { attributes: [] } },
        ],
      },
    );
    return successRequest(200, allPosts);
  } catch (err) {
    return erroRequest(401, expiredToken);
  }
};

const getPostById = async (id, token) => {
  try {
    const { id: userId } = await decoder(token);
    await User.findOne({ where: { id: userId } });
  
    const allPosts = await BlogPost.findOne(
      {
        where: { id },
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Categorie, as: 'categories', through: { attributes: [] } },
        ],
      },
    );
    return allPosts ? successRequest(200, allPosts) : erroRequest(404, fielfInexist('Post'));
  } catch (err) {
    return erroRequest(401, expiredToken);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
};
