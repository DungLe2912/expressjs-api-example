const bcrypt = require('bcrypt');
const lodash = require('lodash');
const { SALT_ROUND } = require('../constants/user.constants');

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

function formatDate(date) {
  const dateFormat = new Date(date);
  let result = '';
  if (dateFormat.getDate() < 10) {
    result = `0${dateFormat.getDate()}/`;
  } else {
    result += `${dateFormat.getDate()}/`;
  }
  if (dateFormat.getMonth() + 1 < 10) {
    result += `0${dateFormat.getMonth() + 1}/`;
  } else {
    result += `${dateFormat.getMonth() + 1}/`;
  }
  result += dateFormat.getFullYear();
  return result;
}
module.exports = {
  hashPassword,
  comparePassword,
  normalizeHumanName,
  formatDate,
};
