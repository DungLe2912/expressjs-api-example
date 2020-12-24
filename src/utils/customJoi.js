/* eslint-disable no-unused-vars */
const { Joi } = require('express-validation');
const { isValidObjectId } = require('mongoose');
const moment = require('moment');

const { role } = require('../constants/role');

const {
  MIN_LEN_BODY,
  MAX_LEN_BODY,
} = require('../constants/post.constants');
const {
  MIN_LEN_FULLNAME,
  MAX_LEN_FULLNAME,
  MIN_LEN_PW,
  MAX_LEN_PW,
} = require('../constants/user.constants');

const {
  normalizeHumanName,
} = require('./helpers');

function removeAscent(str) {
  let tmp = str;
  if (tmp === null || tmp === undefined) return tmp;
  tmp = tmp
    .normalize('NFC')
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd');
  return tmp;
}
const customJoi = Joi.extend(
  (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
      'string.content.length': `Body length ranges from ${MIN_LEN_BODY} to ${MAX_LEN_BODY}.`,
      'string.content.invalid': 'Body must be HTML code.',
      'string.password.length': `Password length ranges from ${MIN_LEN_PW} to ${MAX_LEN_PW}.`,
      'string.password.invalid': 'Password must include letters and numbers.',
      'string.confirm_password.not_match':
        'Confirm password not match.',
      'string.fullname.invalid': `The name contains only alphanumeric characters and ranges in length from ${MIN_LEN_FULLNAME} to ${MAX_LEN_FULLNAME}`,
      'string.date.invalid': 'Wrong date format DD-MM-YYYY.',
      'string.birthday.invalid':
          'Date of birth must be before the current date.',
      'string.role.invalid': 'Role must be admin or user.',
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
      confirmPassword: {
        multi: true, // Rule supports multiple invocations
        method(candidate) {
          return this.$_addRule({
            name: 'confirmPassword',
            args: { candidate },
          });
        },
        args: [
          {
            name: 'candidate',
            ref: true,
            assert: (value) => typeof value === 'string',
            message: 'must be a number',
          },
        ],
        validate(value, helpers, args, _options) {
          if (value === args.candidate) {
            return value;
          }
          return helpers.error('string.confirm_password.not_match');
        },
      },
      role: {
        validate(value, helpers, _args, _options) {
          if (!Object.values(role).includes(value)) {
            return helpers.error('string.role.invalid');
          }
          return value;
        },
      },
      fullName: {
        validate(value, helpers, _args, _options) {
          const fullName = normalizeHumanName(value);

          const pattern = new RegExp(
            `^[A-Za-z\\s]{${MIN_LEN_FULLNAME},${MAX_LEN_FULLNAME}}$`,
          );

          if (pattern.test(removeAscent(fullName))) {
            return fullName;
          }
          return helpers.error('string.fullname.invalid');
        },
      },
      birthday: {
        validate(value, helpers, _args, _options) {
          try {
            const temp = moment(value, 'DD-MM-YYYY');
            if (temp.isAfter(moment(new Date()))) {
              return helpers.error('string.birthday.invalid');
            }
            return temp;
          } catch (e) {
            return helpers.error('string.date.invalid', e);
          }
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
