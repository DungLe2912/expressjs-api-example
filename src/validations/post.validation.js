const customJoi = require('../utils/customJoi');

module.exports = {
  createPostValidation: {
    body: customJoi.object({
      title: customJoi.string().required(),
      description: customJoi.string().required(),
      body: customJoi.string().content().required(),
    }),
  },

  getListPostValidation: {
    query: customJoi.object({
      limit: customJoi.number().min(5).required(),
      page: customJoi.number().min(1).required(),
    }),
  },

  getPostValidation: {
    params: customJoi.object({
      id: customJoi.string().isObjectId().required(),
    }),
  },

  deletePostValidation: {
    params: customJoi.object({
      id: customJoi.string().isObjectId().required(),
    }),
  },

  updatePostValidation: {
    params: customJoi.object({
      id: customJoi.string().isObjectId().required(),
    }),
  },
};
