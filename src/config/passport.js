const passport = require('passport');
const httpStatus = require('http-status');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const customJoi = require('../utils/customJoi');
const APIError = require('../utils/APIError');
const { comparePassword } = require('../utils/helpers');
const { role } = require('../constants/role');
const { APP_SECRET } = require('./vars');
const User = require('../models/user.model');
require('dotenv').config();

passport.use(
  'email',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const schema = customJoi.object({
          email: customJoi.string().email().required(),
          password: customJoi.string().password().required(),
        });
        const { error, value } = schema.validate({
          email,
          password,
        });
        if (error) {
          const detail = error.details[0];
          return done(
            new APIError({
              errors: error,
              status: httpStatus.BAD_REQUEST,
              message: detail.message,
            }),
            false,
          );
        }
        const account = await User.findOne({
          email: value.email,
        });
        if (!account) {
          return done(
            new APIError({
              errors: new Error('Email or password incorrect.'),
              status: httpStatus.NOT_FOUND,
              message: 'Email or password incorrect.',
            }),
            false,
          );
        }
        const isSame = await comparePassword(
          value.password,
          account.password,
        );

        if (!isSame) {
          return done(
            new APIError({
              errors: new Error('Email or password incorrect.'),
              status: httpStatus.NOT_FOUND,
              message: 'Email or password incorrect.',
            }),
            false,
          );
        }
        if (!Object.values(role).includes(account.role)) {
          return done(
            new APIError({
              errors: new Error('You do not have permission to login.'),
              status: httpStatus.FORBIDDEN,
              message: 'You do not have permission to login.',
            }),
            false,
          );
        }
        return done(null, account);
      } catch (e) {
        return done(
          new APIError({
            errors: e,
            status: httpStatus.BAD_REQUEST,
            message: 'Can not login.',
          }),
          false,
        );
      }
    },
  ),
);

passport.use(
  'emailJWT',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: APP_SECRET,
    },
    async (payload, done) => {
      const { _id } = payload;
      try {
        const {
          error,
        } = customJoi.string().isObjectId().required().validate(_id);
        if (error) {
          return done(
            new APIError({
              errors: new Error('Invalid token.'),
              status: httpStatus.FORBIDDEN,
              message: 'Invalid token.',
            }),
            false,
          );
        }
        const user = await User.findById(_id);
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (e) {
        return done(e, false);
      }
    },
  ),
);
