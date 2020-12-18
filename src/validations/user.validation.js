const httpStatus = require('http-status');
const V = require('../utils/customJoi');
const APIError = require('../utils/APIError');

module.exports = {
  signUpValidation(req, _res, next) {
    const {
      email,
      password,
      confirmPassword,
      role,
      fullName,
      birthday,
    } = req.body;

    const schema = V.object({
      email: V.string().email().required(),
      password: V.string().password().required(),
      confirmPassword: V.string()
        .required()
        .confirmPassword(V.ref('password')),
      role: V.string().role().required(),
      fullName: V.string().required().fullName(),
      birthday: V.string().required().birthday(),
    });
    const validatedValues = schema.validate({
      email,
      password,
      confirmPassword,
      role,
      fullName,
      birthday,
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

  signInValidation(req, _res, next) {
    const {
      email,
      password,
    } = req.body;
    const schema = V.object({
      email: V.string().email().required(),
      password: V.string().required(),
    });
    const { error } = schema.validate({
      email,
      password,
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
};
