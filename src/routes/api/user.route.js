const express = require('express');
const userController = require('../../controllers/user.controller');
const {
  signInValidation,
  signUpValidation,
} = require('../../validations/user.validation');

const router = express.Router();

// POST /user/sign-up
router.route('/sign-up')
  .post(signUpValidation, userController.signUp);

// POST /api/sign-in
router.route('/sign-in')
  .post(signInValidation, userController.signIn);

module.exports = router;
