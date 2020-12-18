const httpStatus = require('http-status');
const V = require('../utils/customJoi');
const APIError = require('../utils/APIError');

module.exports = {
  createPostValidation(req, _res, next) {
    const { title, body, description } = req.body;
    const schema = V.object({
      title: V.string().required(),
      description: V.string().required(),
      body: V.string().content().required(),
    });
    const validatedValues = schema.validate({
      title,
      description,
      body,
    });
    const { error } = validatedValues;
    if (error) {
      const detail = error.details[0];
      throw new APIError({
        errors: error,
        status: httpStatus.BAD_REQUEST,
        message: detail.message,
      });
    }
    next();
  },

  getListPostValidation(req, _res, next) {
    const { limit, page } = req.query;
    const schema = V.object({
      limit: V.number().min(5).required(),
      page: V.number().min(1).required(),
    });
    const { error } = schema.validate({
      limit,
      page,
    });
    if (error) {
      const detail = error.details[0];
      throw new APIError({
        errors: error,
        status: httpStatus.BAD_REQUEST,
        message: detail.message,
      });
    }
    next();
  },

  getPostValidation(req, _res, next) {
    const { id } = req.params;
    if (!id) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Resource not found',
      });
    }
    const {
      error: errorV,
    } = V.string().isObjectId().required().validate(id);

    if (errorV) {
      const detail = errorV.details[0];
      throw new APIError({
        errors: errorV,
        status: httpStatus.BAD_REQUEST,
        message: detail.message,
      });
    }
    next();
  },

  deletePostValidation(req, _res, next) {
    const { id } = req.params;
    if (!id) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Resource not found',
      });
    }
    const {
      error: errorV,
    } = V.string().isObjectId().required().validate(id);

    if (errorV) {
      const detail = errorV.details[0];
      throw new APIError({
        errors: errorV,
        status: httpStatus.BAD_REQUEST,
        message: detail.message,
      });
    }
    next();
  },
  updatePostValidation(req, _res, next) {
    const { id } = req.params;
    if (!id) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Resource not found',
      });
    }
    const {
      error: errorV,
    } = V.string().isObjectId().required().validate(id);

    if (errorV) {
      const detail = errorV.details[0];
      throw new APIError({
        errors: errorV,
        status: httpStatus.BAD_REQUEST,
        message: detail.message,
      });
    }
    next();
  },
};
