const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  MIN_LEN_FULLNAME: 3,
  MAX_LEN_FULLNAME: 35,
  MIN_LEN_BODY: 0,
  MAX_LEN_BODY: 9999,
  MIN_LEN_PW: 8,
  MAX_LEN_PW: 30,
  SALT_ROUND: 10,
  APP_SECRET: process.env.APP_SECRET,
  TOKEN_LIVING_TIME: process.env.TOKEN_LIVING_TIME,
};
