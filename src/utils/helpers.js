const bcrypt = require('bcrypt');
const lodash = require('lodash');
const { SALT_ROUND } = require('../constants/variable');

async function comparePassword(password, encrypted) {
  const isSame = await bcrypt.compare(password, encrypted);
  return isSame;
}

async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, SALT_ROUND);
  return hashed;
}

function normalizeHumanName(fullName) {
  const newName = lodash.trim(fullName);
  const arrs = lodash.split(newName, ' ');
  let result = '';

  arrs.forEach((word) => {
    result += ` ${lodash.upperFirst(word)}`;
  });

  result = lodash.trimStart(result);

  return result;
}
module.exports = {
  hashPassword,
  comparePassword,
  normalizeHumanName,
};
