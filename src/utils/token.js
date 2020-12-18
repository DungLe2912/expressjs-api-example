const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { APP_SECRET, TOKEN_LIVING_TIME } = require('../constants/variable');

const tokenOptions = {
  expiresIn: TOKEN_LIVING_TIME,
};

class Token {
  static async signAsync(payload, options = {}) {
    const sign = promisify(jwt.sign);
    const token = await sign(payload, APP_SECRET, {
      ...tokenOptions,
      ...options,
    });
    return token;
  }

  static async verifyAsync(token, options = {}) {
    const verify = promisify(jwt.verify);
    const data = await verify(token, APP_SECRET, options);
    return data;
  }

  static async sign(payload, options = {}) {
    const token = jwt.sign(payload, APP_SECRET, {
      ...tokenOptions,
      ...options,
    });
    return token;
  }

  static async verify(token, options = {}) {
    const data = jwt.verify(token, APP_SECRET, options);
    return data;
  }
}

module.exports = { Token };
