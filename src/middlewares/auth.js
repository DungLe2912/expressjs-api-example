const passport = require('passport');
const httpStatus = require('http-status');

const APIError = require('../utils/APIError');
const { role } = require('../constants/role');

function authenticate() {
  return (req, res, next) => {
    passport.authenticate(
      'emailJWT',
      { session: false },
      // eslint-disable-next-line no-unused-vars
      (error, user, _info) => {
        if (error) {
          return next(
            new APIError({
              errors: error,
              status: httpStatus.INTERNAL_SERVER_ERROR,
              message: error.message,
            }),
          );
        }
        if (!user) {
          return next(
            new APIError({
              errors: new Error('Invalid token.'),
              status: httpStatus.UNAUTHORIZED,
              message: 'Invalid token.',
            }),
          );
        }

        req.user = user;
        return next();
      },
    )(req, res, next);
  };
}

function authorize(roles = []) {
  let authorizeRoles = roles;
  if (typeof roles === 'string') {
    authorizeRoles = [roles];
  }

  return (req, res, next) => {
    let isExisted = false;
    for (let i = 0; i < authorizeRoles.length; i += 1) {
      if (Object.values(role).includes(authorizeRoles[i])) {
        isExisted = true;
        break;
      }
    }

    if (!isExisted) {
      throw new APIError({
        errors: new Error('Internal Server Error.'),
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    if (
      authorizeRoles.length
        && !authorizeRoles.includes(req.user.role)
    ) {
      throw new APIError({
        errors: new Error('You do not have permission to login.'),
        status: httpStatus.FORBIDDEN,
        message: 'You do not have permission to login.',
      });
    }

    if (!req.user) {
      throw new APIError({
        errors: new Error('User is not exist.'),
        status: httpStatus.FORBIDDEN,
        message: 'User is not exist.',
      });
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
