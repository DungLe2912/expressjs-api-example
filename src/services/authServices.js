const httpStatus = require('http-status');

const User = require('../models/user.model');
const { Token } = require('../utils/token');
const APIError = require('../utils/APIError');

async function createTokens(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new APIError({
        errors: new Error('User is not exist.'),
        status: httpStatus.NOT_FOUND,
        message: 'User is not exist.',
      });
    }
    const jsonUser = user.toJSON();
    delete jsonUser.password;
    // generate token
    const accessToken = await Token.signAsync(jsonUser);
    const refreshToken = await Token.signAsync(
      { id: jsonUser.id },
      { expiresIn: '7d' },
    );
    return {
      accessToken,
      refreshToken,
    };
  } catch (e) {
    throw new APIError({
      errors: e,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}

module.exports = {
  createTokens,
};
