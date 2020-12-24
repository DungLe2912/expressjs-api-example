const mongoose = require('mongoose');

/**
 * Schema
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
userSchema.method({});

/**
 * Statics
 */
userSchema.statics = {};

module.exports = mongoose.model('User', userSchema);
