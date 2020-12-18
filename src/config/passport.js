const passport = require('passport');
const httpStatus = require('http-status');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const V = require('../utils/customJoi');
const APIError = require('../utils/APIError');
const { comparePassword } = require('../utils/helpers');
const { role } = require('../constants/role');
const { APP_SECRET } = require('../constants/variable');
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
        const schema = V.object({
          email: V.string().email().required(),
          password: V.string().password().required(),
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
              errors: new Error('Email hoặc mật khẩu không đúng.'),
              status: httpStatus.NOT_FOUND,
              message: 'Email hoặc mật khẩu không đúng.',
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
              errors: new Error('Email hoặc mật khẩu không đúng.'),
              status: httpStatus.NOT_FOUND,
              message: 'Email hoặc mật khẩu không đúng.',
            }),
            false,
          );
        }
        if (!Object.values(role).includes(account.role)) {
          return done(
            new APIError({
              errors: new Error('Bạn không có quyền đăng nhập.'),
              status: httpStatus.FORBIDDEN,
              message: 'Bạn không có quyền đăng nhập.',
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
            message: 'Không thể đăng nhập lúc này.',
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
        } = V.string().isObjectId().required().validate(_id);
        if (error) {
          return done(
            new APIError({
              errors: new Error('Token không hợp lệ.'),
              status: httpStatus.FORBIDDEN,
              message: 'Token không hợp lệ.',
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
