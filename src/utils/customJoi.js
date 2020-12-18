/* eslint-disable no-unused-vars */
const { Joi } = require('express-validation');
const { isValidObjectId } = require('mongoose');
const {
  MIN_LEN_FULLNAME,
  MAX_LEN_FULLNAME,
  MIN_LEN_PW,
  MAX_LEN_PW,
  MIN_LEN_BODY,
  MAX_LEN_BODY,
} = require('../constants/variable');

const customJoi = Joi.extend(
  (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
      'string.content.length': `Độ dài body trong khoảng từ ${MIN_LEN_BODY} đến ${MAX_LEN_BODY}.`,
      'string.content.invalid': 'Body phải là mã HTML.',
      'string.password.length': `Độ dài mật khẩu trong khoảng từ ${MIN_LEN_PW} đến ${MAX_LEN_PW}.`,
      'string.password.invalid': 'Mật khẩu phải gồm chữ và số.',
      'string.in.invalid': 'Value is not contain in array',
      'string.objectId.invalid': 'ObjectId is not valid',
    },
    rules: {
      content: {
        validate(value, helpers, _args, _options) {
          if (
            value.length < MIN_LEN_BODY || value.length > MAX_LEN_BODY
          ) {
            return helpers.error('string.content.length');
          }
          if (/<\/?[a-z][\s\S]*>/i.test(value)) {
            return value;
          }
          return helpers.error('string.content.invalid');
        },
      },
      password: {
        validate(value, helpers, _args, _options) {
          if (
            value.length < MIN_LEN_FULLNAME
                || value.length > MAX_LEN_FULLNAME
          ) {
            return helpers.error('string.password.length');
          }
          const pattern = new RegExp(
            `^((?=.*[a-zA-Z])(?=.*[0-9]))\\w{${MIN_LEN_PW},${MAX_LEN_PW}}$`,
            'g',
          );
          if (pattern.test(value)) {
            return value;
          }
          return helpers.error('string.password.invalid');
        },
      },
      in: {
        method(array) {
          return this.$_addRule({
            name: 'in',
            args: { array },
          });
        },
        args: [
          {
            name: 'array',
            // ref: true,
            assert: (value) => typeof value === 'object',
            message: 'must be an array',
          },
        ],
        validate(value, helpers, args, _options) {
          if ((args.array || []).includes(value)) {
            return value;
          }
          return helpers.error('string.in.invalid');
        },
      },
      isObjectId: {
        validate(value, helpers, _args, _options) {
          if (isValidObjectId(value)) {
            return value;
          }
          return helpers.error('string.objectId.invalid');
        },
      },
    },
  }),
  (joi) => ({
    type: 'number',
    base: joi.number(),
    messages: {
      'number.in.invalid': 'Value is not contain in array',
    },
    rules: {
      in: {
        method(array) {
          return this.$_addRule({
            name: 'in',
            args: { array },
          });
        },
        args: [
          {
            name: 'array',
            // ref: true,
            assert: (value) => typeof value === 'object',
            message: 'must be an array',
          },
        ],
        validate(value, helpers, args, _options) {
          if ((args.array || []).includes(value)) {
            return value;
          }
          return helpers.error('number.in.invalid');
        },
      },
    },
  }),
);

module.exports = customJoi;
