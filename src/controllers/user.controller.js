const httpStatus = require('http-status');

const passport = require('passport');
const User = require('../models/user.model');
const { userSerializer } = require('../serializers/user.serializer');
const { hashPassword, formatDate } = require('../utils/helpers');
const { createTokens } = require('../services/authServices');

exports.signUp = async (req, res, next) => {
  try {
    const data = req.body;
    const { password } = data;
    const hashed = await hashPassword(password);
    data.password = hashed;
    delete data.confirmPassword;
    const user = new User(data);
    const savedUser = await user.save();

    res.json({
      post: userSerializer(savedUser),
    });
  } catch (error) {
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  passport.authenticate(
    'email',
    { session: false },
    // eslint-disable-next-line no-unused-vars
    async (error, account, _info) => {
      if (error) {
        return next(error);
      }
      try {
        const userTemp = account.toJSON();
        delete userTemp.password;

        // generate token
        const tokens = await createTokens(account.id);
        return res.status(httpStatus.OK).json(tokens);
      } catch (e) {
        return next(e);
      }
    },
  )(req, res, next);
};

exports.getInfo = async (req, res, next) => {
  const { id } = req.user;
  try {
    const account = await User.findById(id);
    const userTemp = account.toJSON();
    delete userTemp.password;
    
    return res.status(httpStatus.OK).json({
      ...userTemp,
      birthday: formatDate(userTemp.birthday)
    });
  } catch (e) {
    return next(e);
  }
};
