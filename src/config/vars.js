const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGO_URI,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  morganLogFormat: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  APP_SECRET: process.env.APP_SECRET,
  TOKEN_LIVING_TIME: process.env.TOKEN_LIVING_TIME,
};
